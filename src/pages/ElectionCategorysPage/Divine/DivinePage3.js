import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";

const C = {
  primary:   "#93210A",
  dark:      "#301913",
  bg:        "#1a0a00",
  cardBg:    "#2a1208",
  gold:      "#DAA520",
  goldLight: "#FFF0EE",
  cream:     "#FDF5E6",
  textMain:  "#FFFFFF",
  textSub:   "#b0a090",
  white:     "#fff",
  surface:   "#2e1510",
  divider:   "rgba(218,165,32,0.2)",
};

// ─────────────────────────────────────────────
// Audio Style Player Component
// ─────────────────────────────────────────────
function AudioStylePlayer({
  videoId,
  title,
  subtitle,
  thumbUri,
  isTablet,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) {
  const playerRef     = useRef(null);
  const intervalRef   = useRef(null);
  const stateCheckRef = useRef(null);
  const spinAnim      = useRef(new Animated.Value(0)).current;
  const spinLoopRef   = useRef(null);

  const [playing,     setPlaying]     = useState(false);
  const [duration,    setDuration]    = useState(0);
  const [current,     setCurrent]     = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [isSeeking,   setIsSeeking]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  // ── Spin animation for album art ──
  const startSpin = useCallback(() => {
    spinAnim.setValue(0);
    if (spinLoopRef.current) spinLoopRef.current.stop();
    spinLoopRef.current = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoopRef.current.start();
  }, [spinAnim]);

  const stopSpin = useCallback(() => {
    if (spinLoopRef.current) {
      spinLoopRef.current.stop();
      spinLoopRef.current = null;
    }
  }, []);

  const spin = spinAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // ── Poll current time ──
  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (playerRef.current && !isSeeking) {
        try {
          const t = await playerRef.current.getCurrentTime();
          if (t !== undefined && t !== null) setCurrent(t);
        } catch (error) {
          // Silent fail
        }
      }
    }, 500);
  }, [isSeeking]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onReady = useCallback(async () => {
    setIsLoading(false);
    setPlayerReady(true);
    if (playerRef.current) {
      try {
        const d = await playerRef.current.getDuration();
        setDuration(d ?? 0);
      } catch (error) {
        console.log("Get duration error:", error);
      }
    }
  }, []);

  const onStateChange = useCallback(
    (state) => {
      if (state === "playing") {
        setPlaying(true);
        setIsBuffering(false);
        startPolling();
        startSpin();
      } else if (state === "paused") {
        setPlaying(false);
        stopPolling();
        stopSpin();
      } else if (state === "ended") {
        setPlaying(false);
        stopPolling();
        stopSpin();
        setCurrent(0);
        if (playerRef.current) {
          try {
            playerRef.current.seekTo(0, true);
          } catch (error) {
            console.log("Seek to start error:", error);
          }
        }
        // Auto-advance to the next song when this one finishes, if available
        if (hasNext && onNext) {
          onNext();
        }
      } else if (state === "buffering") {
        setIsBuffering(true);
      } else if (state === "unstarted") {
        setPlaying(false);
        setIsLoading(false);
      }
    },
    [startPolling, stopPolling, startSpin, stopSpin, hasNext, onNext]
  );

  const onError = useCallback((error) => {
    console.log("Player error:", error);
    setIsLoading(false);
    setIsBuffering(false);
    setPlaying(false);
    stopPolling();
    stopSpin();
  }, [stopPolling, stopSpin]);

  // Safety net: catches missed onChangeState events by checking the
  // player's actual reported state every second and correcting `playing`.
  useEffect(() => {
    stateCheckRef.current = setInterval(async () => {
      if (!playerRef.current || !playerReady) return;
      try {
        const actualState = await playerRef.current.getPlayerState();
        if (actualState === 1 && !playing) {
          setPlaying(true);
          startPolling();
          startSpin();
        } else if (actualState === 2 && playing) {
          setPlaying(false);
          stopPolling();
          stopSpin();
        }
      } catch (error) {
        // Silent fail
      }
    }, 1000);
    return () => {
      if (stateCheckRef.current) clearInterval(stateCheckRef.current);
    };
  }, [playerReady, playing, startPolling, stopPolling, startSpin, stopSpin]);

  useEffect(() => {
    return () => {
      stopPolling();
      stopSpin();
    };
  }, [stopPolling, stopSpin]);

  // ── Play/Pause Toggle ──
  // Flips `playing` (drives the `play` prop below) AND mutes/unMutes
  // immediately — mute()/unMute() are real supported ref methods and take
  // effect instantly. On top of that, when turning play ON we also force a
  // seekTo() to the current position: on some devices just flipping the
  // `play` prop doesn't actually kick the underlying WebView into playing
  // until a seek happens (this is why tapping skip used to "fix" it) — so
  // we do that seek ourselves right here instead of relying on the user
  // to trigger it manually.
  const togglePlay = useCallback(async () => {
    if (!playerReady) return;
    const next = !playing;
    setPlaying(next);
    try {
      if (next) {
        await playerRef.current?.unMute();
        await playerRef.current?.seekTo(current || 0, true);
      } else {
        await playerRef.current?.mute();
      }
    } catch (error) {
      console.log("Mute toggle error:", error);
    }
  }, [playing, playerReady, current]);

  const seekTo = useCallback(async (val) => {
    if (!playerRef.current || !playerReady) return;
    setIsSeeking(true);
    try {
      await playerRef.current.seekTo(val, true);
      setCurrent(val);
    } catch (error) {
      console.log("Seek error:", error);
    }
    setIsSeeking(false);
  }, [playerReady]);

  const skipBy = useCallback(async (secs) => {
    if (!playerRef.current || !playerReady) return;
    const newTime = Math.max(0, Math.min(current + secs, duration));
    setIsSeeking(true);
    try {
      await playerRef.current.seekTo(newTime, true);
      setCurrent(newTime);
    } catch (error) {
      console.log("Skip error:", error);
    }
    setIsSeeking(false);
  }, [current, duration, playerReady]);

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? Math.min(current / duration, 1) : 0;
  const artSize  = isTablet ? 220 : 180;

  return (
    <View style={[ap.wrap, isTablet && ap.wrapTablet]}>

      {/* Full-opacity, real-size player pushed off-screen — near-zero-size
          or opacity:0 elements get throttled by the WebView engine, which
          caused the original play delay / unreliable pause. */}
      <View style={{ position: "absolute", top: -2000, left: 0, width: 300, height: 170 }}>
        <YoutubePlayer
          ref={playerRef}
          height={170}
          width={300}
          play={playing}
          videoId={videoId}
          onReady={onReady}
          onChangeState={onStateChange}
          onError={onError}
          webViewProps={{ androidLayerType: "hardware", allowsInlineMediaPlayback: true }}
          initialPlayerParams={{
            playsInline: true,
            controls: false,
            modestbranding: true,
            rel: false,
            showClosedCaptions: false,
          }}
        />
      </View>

      {/* ── Spinning Album Art ── */}
      <View style={{ marginBottom: 24, alignItems: "center" }}>
        <Animated.View
          style={[
            ap.artWrap,
            {
              width: artSize,
              height: artSize,
              borderRadius: artSize / 2,
              transform: [{ rotate: playing && !isBuffering ? spin : "0deg" }],
            },
          ]}
        >
          {isLoading && (
            <View style={[ap.artPlaceholder, { width: artSize, height: artSize, borderRadius: artSize / 2 }]}>
              <ActivityIndicator size="large" color={C.gold} />
            </View>
          )}
          {!isLoading && thumbUri ? (
            <Image
              source={{ uri: thumbUri }}
              style={{ width: artSize, height: artSize, borderRadius: artSize / 2 }}
              resizeMode="cover"
            />
          ) : !isLoading ? (
            <View style={[ap.artPlaceholder, { width: artSize, height: artSize, borderRadius: artSize / 2 }]}>
              <Text style={{ fontSize: isTablet ? 64 : 52 }}>🕉️</Text>
            </View>
          ) : null}
        </Animated.View>
      </View>

      {/* ── Title & Subtitle ── */}
      <Text style={[ap.title, isTablet && ap.titleTablet]} numberOfLines={2}>
        {title}
      </Text>
      {!!subtitle && (
        <Text style={[ap.subtitle, isTablet && ap.subtitleTablet]} numberOfLines={1}>
          {subtitle}
        </Text>
      )}

      {/* ── Progress Bar ── */}
      <View style={ap.progressWrap}>
        <View style={ap.progressTrack}>
          <View style={[ap.progressFill, { width: `${progress * 100}%` }]} />
          <View style={[ap.progressThumb, { left: `${progress * 100}%` }]} />
        </View>
        <Slider
          style={ap.slider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={current}
          onSlidingStart={() => setIsSeeking(true)}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="transparent"
        />
      </View>

      {/* ── Time labels ── */}
      <View style={ap.timeRow}>
        <Text style={ap.timeText}>{fmt(current)}</Text>
        <Text style={ap.timeText}>{fmt(duration)}</Text>
      </View>

      {/* ── Controls ── */}
      <View style={ap.controls}>
        {/* 10s back — small */}
        <TouchableOpacity onPress={() => skipBy(-10)} style={ap.sideBtnSmall} activeOpacity={0.7} disabled={!playerReady || isLoading}>
          <Ionicons name="play-skip-back" size={isTablet ? 22 : 18} color={playerReady ? C.textSub : "rgba(255,255,255,0.2)"} />
          <Text style={[ap.skipLabelSmall, !playerReady && { opacity: 0.3 }]}>10</Text>
        </TouchableOpacity>

        {/* Previous song — big, same size as Next */}
        <TouchableOpacity
          onPress={onPrevious}
          style={ap.sideBtnBig}
          activeOpacity={0.7}
          disabled={!hasPrevious}
        >
          <Ionicons
            name="play-skip-back-circle"
            size={isTablet ? 40 : 34}
            color={hasPrevious ? C.gold : "rgba(255,255,255,0.2)"}
          />
          <Text style={[ap.skipLabel, !hasPrevious && { opacity: 0.3 }]}>PREV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlay}
          style={[ap.playBtn, isTablet && ap.playBtnTablet, (!playerReady || isLoading) && ap.playBtnDisabled]}
          disabled={!playerReady || isLoading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[C.primary, C.dark]}
            style={[ap.playGradient, isTablet && { width: 76, height: 76, borderRadius: 38 }]}
          >
            {isBuffering ? (
              <ActivityIndicator size="small" color={C.white} />
            ) : (
              <Ionicons
                name={playing ? "pause" : "play"}
                size={isTablet ? 36 : 30}
                color={C.white}
                style={!playing ? { marginLeft: 3 } : {}}
              />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Next song — big, same size as Prev */}
        <TouchableOpacity
          onPress={onNext}
          style={ap.sideBtnBig}
          activeOpacity={0.7}
          disabled={!hasNext}
        >
          <Ionicons
            name="play-skip-forward-circle"
            size={isTablet ? 40 : 34}
            color={hasNext ? C.gold : "rgba(255,255,255,0.2)"}
          />
          <Text style={[ap.skipLabel, !hasNext && { opacity: 0.3 }]}>NEXT</Text>
        </TouchableOpacity>

        {/* 10s forward — small */}
        <TouchableOpacity onPress={() => skipBy(10)} style={ap.sideBtnSmall} activeOpacity={0.7} disabled={!playerReady || isLoading}>
          <Ionicons name="play-skip-forward" size={isTablet ? 22 : 18} color={playerReady ? C.textSub : "rgba(255,255,255,0.2)"} />
          <Text style={[ap.skipLabelSmall, !playerReady && { opacity: 0.3 }]}>10</Text>
        </TouchableOpacity>
      </View>

      {/* ── Loading ── */}
      {isLoading && (
        <View style={ap.loadingRow}>
          <ActivityIndicator size="small" color={C.gold} />
          <Text style={ap.loadingText}>Loading audio...</Text>
        </View>
      )}

      {isBuffering && !isLoading && (
        <View style={ap.loadingRow}>
          <ActivityIndicator size="small" color={C.gold} />
          <Text style={ap.loadingText}>Buffering...</Text>
        </View>
      )}

      {/* ── Now Playing indicator ── */}
      {playing && !isBuffering && playerReady && (
        <View style={ap.nowPlayingRow}>
          <View style={ap.nowPlayingDot} />
          <View style={[ap.nowPlayingDot, { height: 14 }]} />
          <View style={[ap.nowPlayingDot, { height: 10 }]} />
          <View style={[ap.nowPlayingDot, { height: 16 }]} />
          <View style={[ap.nowPlayingDot, { height: 8 }]} />
          <Text style={ap.nowPlayingText}>NOW PLAYING</Text>
        </View>
      )}
    </View>
  );
}

const ap = StyleSheet.create({
  wrap: {
    backgroundColor: "#2a1208",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(218,165,32,0.25)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  wrapTablet: { paddingVertical: 36, paddingHorizontal: 32, borderRadius: 28 },
  artWrap: {
    borderWidth: 3,
    borderColor: C.gold,
    overflow: "hidden",
    elevation: 10,
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  artPlaceholder: { backgroundColor: "#1a0a00", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "800", color: C.white, textAlign: "center", marginBottom: 4, letterSpacing: 0.3, paddingHorizontal: 8 },
  titleTablet: { fontSize: 22 },
  subtitle: { fontSize: 14, color: C.textSub, fontWeight: "500", textAlign: "center", marginBottom: 24 },
  subtitleTablet: { fontSize: 16 },
  progressWrap: { width: "100%", height: 36, justifyContent: "center", marginBottom: 0 },
  progressTrack: { position: "absolute", left: 0, right: 0, height: 3, backgroundColor: "rgba(218,165,32,0.2)", borderRadius: 2, overflow: "visible" },
  progressFill: { height: "100%", backgroundColor: C.gold, borderRadius: 2 },
  progressThumb: { position: "absolute", top: -5, width: 13, height: 13, borderRadius: 6.5, backgroundColor: C.gold, marginLeft: -6.5, elevation: 3 },
  slider: { position: "absolute", left: -10, right: -10, height: 36, opacity: 0 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 24, marginTop: 4 },
  timeText: { fontSize: 11, color: C.textSub, fontWeight: "600" },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 16 },
  sideBtnSmall: { alignItems: "center", justifyContent: "center", width: 32, height: 32 },
  sideBtnBig:   { alignItems: "center", justifyContent: "center", width: 48, height: 48 },
  skipLabel:      { fontSize: 9, color: C.textSub, fontWeight: "700", marginTop: 2, letterSpacing: 0.3 },
  skipLabelSmall: { fontSize: 8, color: C.textSub, fontWeight: "700", marginTop: 2, letterSpacing: 0.3 },
  playBtn: { elevation: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10 },
  playBtnTablet: {},
  playBtnDisabled: { opacity: 0.4 },
  playGradient: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", borderWidth: 2.5, borderColor: C.gold },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  loadingText: { fontSize: 12, color: C.gold, fontWeight: "600", letterSpacing: 0.5 },
  nowPlayingRow: { flexDirection: "row", alignItems: "flex-end", gap: 3, marginTop: 8 },
  nowPlayingDot: { width: 3, height: 18, backgroundColor: C.gold, borderRadius: 2, opacity: 0.8 },
  nowPlayingText: { fontSize: 10, color: C.gold, fontWeight: "800", letterSpacing: 1.5, marginLeft: 6 },
});

const LYRICS_PREVIEW_LINES = 8;

// ─────────────────────────────────────────────
// Main DivinePage3
// ─────────────────────────────────────────────
export default function DivinePage3() {
  const navigation = useNavigation();
  const route      = useRoute();
  // `data` is the song that was tapped to get here.
  // `relatedSongs`, if passed, is the list of songs to page through with
  // the Next / Previous buttons (same shape as `data`: video, title,
  // subtitle, bannerImage, lyrics, gallery, galleryTitles). If it isn't
  // passed, Next/Previous simply render disabled.
  const { data, relatedSongs } = route.params;

  const { width } = useWindowDimensions();
  const isTablet  = width >= 600;

  // ── Playlist state (drives Next / Previous) ──
  const playlist = useMemo(() => {
    if (Array.isArray(relatedSongs) && relatedSongs.length > 0) return relatedSongs;
    return [data];
  }, [relatedSongs, data]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (Array.isArray(relatedSongs) && relatedSongs.length > 0) {
      const idx = relatedSongs.findIndex((item) => item?.id === data?.id);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentSong = playlist[currentIndex] || data;

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;

  const goToNext = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, playlist.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const [activeTab, setActiveTab] = useState("lyrics");
  const [lyricsExpanded, setLyricsExpanded] = useState(false);

  // Reset tab/expanded state whenever the song changes
  useEffect(() => {
    setActiveTab("lyrics");
    setLyricsExpanded(false);
  }, [currentIndex]);

  // ── Lyrics (Tamil) ──
  const lyricsText = useMemo(
    () => (currentSong?.lyrics || currentSong?.description || "").trim(),
    [currentSong?.lyrics, currentSong?.description]
  );

  const lyricLines = useMemo(() => {
    if (!lyricsText) return [];
    return lyricsText.split("\n");
  }, [lyricsText]);

  const showLyricsToggle = lyricLines.length > LYRICS_PREVIEW_LINES;
  const visibleLyricLines = lyricsExpanded
    ? lyricLines
    : lyricLines.slice(0, LYRICS_PREVIEW_LINES);

  // ── Gallery ──
  const galleryImages = useMemo(
    () => (Array.isArray(currentSong?.gallery) ? currentSong.gallery : []),
    [currentSong?.gallery]
  );
  const getGalleryCaption = (index) =>
    Array.isArray(currentSong?.galleryTitles) && currentSong.galleryTitles[index]
      ? currentSong.galleryTitles[index]
      : `Image ${String(index + 1).padStart(2, "0")}`;

  // ── YouTube ID ──
  const getYoutubeId = (url) => {
    if (!url) return null;
    if (/^[\w-]{11}$/.test(url)) return url;
    const patterns = [
      /youtu\.be\/([\w-]{11})/i,
      /youtube\.com\/watch\?v=([\w-]{11})/i,
      /youtube\.com\/embed\/([\w-]{11})/i,
      /youtube\.com\/shorts\/([\w-]{11})/i,
      /youtube\.com\/v\/([\w-]{11})/i,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m?.[1]) return m[1];
    }
    return url.match(/[?&]v=([\w-]{11})/i)?.[1] || null;
  };

  const videoId = useMemo(() => getYoutubeId(currentSong?.video), [currentSong?.video]);

  const hasLyrics  = lyricLines.length > 0;
  const hasGallery = galleryImages.length > 0;
  const contentPadding = isTablet ? 32 : 18;

  const galleryItemWidth = isTablet ? 180 : 140;

  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity style={[s.galleryItem, { width: galleryItemWidth }]} activeOpacity={0.85}>
      <View style={[s.galleryImageWrap, { width: galleryItemWidth, height: galleryItemWidth }]}>
        <Image source={{ uri: item }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        <LinearGradient colors={["transparent", "rgba(26,10,0,0.7)"]} style={s.galleryGradient} />
        <View style={s.galleryBadge}>
          <Text style={s.galleryBadgeText}>{String(index + 1).padStart(2, "0")}</Text>
        </View>
      </View>
      <Text style={s.galleryCaption} numberOfLines={1}>
        {getGalleryCaption(index)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: isTablet ? 60 : 40 }}
      >

        {/* ── HERO BANNER ── */}
        <View style={s.heroWrap}>
          {!!currentSong?.bannerImage ? (
            <Image
              source={{ uri: currentSong.bannerImage }}
              style={[s.heroBanner, { height: isTablet ? 420 : 300 }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[s.heroPlaceholder, { height: isTablet ? 420 : 300 }]}>
              <Text style={s.heroPlaceholderText}>🕉️</Text>
            </View>
          )}

          <LinearGradient
            colors={["transparent", "rgba(26,10,0,0.5)", C.bg]}
            locations={[0.3, 0.7, 1]}
            style={s.heroGradient}
          />

          <TouchableOpacity
            style={[s.backButton, isTablet && s.backButtonTablet]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={isTablet ? 28 : 24} color={C.white} />
          </TouchableOpacity>

          <View style={[s.omBadge, isTablet && s.omBadgeTablet]}>
            <Text style={[s.omText, isTablet && s.omTextTablet]}>🕉️</Text>
          </View>
        </View>

        {/* ── TITLE BLOCK ── */}
        <View style={[s.titleBlock, { paddingHorizontal: contentPadding }]}>
          <Text style={[s.titleMain, isTablet && s.titleMainTablet]}>
            {currentSong?.title || ""}
          </Text>
          {!!currentSong?.subtitle && (
            <Text style={[s.titleSub, isTablet && s.titleSubTablet]}>
              {currentSong.subtitle}
            </Text>
          )}
          <View style={s.goldBar} />
        </View>

        {/* ── AUDIO STYLE PLAYER ── */}
        {videoId && (
          <View style={{ marginHorizontal: contentPadding, marginBottom: 24 }}>
            <AudioStylePlayer
              // key forces a clean remount (fresh player state) on song change
              key={videoId}
              videoId={videoId}
              title={currentSong?.title || ""}
              subtitle={currentSong?.subtitle || ""}
              thumbUri={currentSong?.bannerImage || null}
              isTablet={isTablet}
              onNext={goToNext}
              onPrevious={goToPrevious}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />
          </View>
        )}

        {/* ── TAB BAR ── */}
        {(hasLyrics || hasGallery) && (
          <>
            <View style={[s.tabBar, { paddingHorizontal: contentPadding }]}>
              {hasLyrics && (
                <TouchableOpacity
                  style={s.tabItem}
                  onPress={() => setActiveTab("lyrics")}
                  activeOpacity={0.8}
                >
                  <Text style={[s.tabText, activeTab === "lyrics" && s.tabTextActive]}>
                    பாடல் வரிகள்
                  </Text>
                  {activeTab === "lyrics" && <View style={s.tabUnderline} />}
                </TouchableOpacity>
              )}
              {hasGallery && (
                <TouchableOpacity
                  style={s.tabItem}
                  onPress={() => setActiveTab("gallery")}
                  activeOpacity={0.8}
                >
                  <Text style={[s.tabText, activeTab === "gallery" && s.tabTextActive]}>
                    GALLERY
                  </Text>
                  {activeTab === "gallery" && <View style={s.tabUnderline} />}
                </TouchableOpacity>
              )}
            </View>
            <View style={[s.divider, { marginHorizontal: contentPadding }]} />
          </>
        )}

        {/* ── LYRICS TAB (Tamil) ── */}
        {activeTab === "lyrics" && hasLyrics && (
          <View style={[s.lyricsBlock, { paddingHorizontal: contentPadding }]}>
            {visibleLyricLines.map((line, i) =>
              line.trim() === "" ? (
                <View key={i} style={{ height: 14 }} />
              ) : (
                <Text key={i} style={[s.lyricLine, isTablet && s.lyricLineTablet]}>
                  {line}
                </Text>
              )
            )}

            {showLyricsToggle && (
              <TouchableOpacity
                style={s.readMoreBtn}
                onPress={() => setLyricsExpanded(!lyricsExpanded)}
                activeOpacity={0.8}
              >
                <Text style={s.readMoreText}>
                  {lyricsExpanded ? "See Less" : "See All"}
                </Text>
                <Ionicons
                  name={lyricsExpanded ? "chevron-up" : "chevron-down"}
                  size={12}
                  color={C.gold}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── GALLERY TAB ── */}
        {activeTab === "gallery" && hasGallery && (
          <View style={{ marginTop: 16 }}>
            <FlatList
              data={galleryImages}
              renderItem={renderGalleryItem}
              keyExtractor={(_, i) => `gallery-${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[s.galleryList, { paddingHorizontal: contentPadding }]}
            />
          </View>
        )}

        {/* ── FOOTER ── */}
        <View style={[s.footer, { marginHorizontal: contentPadding, marginTop: 32 }]}>
          <View style={s.footerLine} />
          <View style={s.footerOmWrap}>
            <Text style={s.footerOm}>ॐ</Text>
          </View>
          <View style={s.footerLine} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

  heroWrap:            { width: "100%", position: "relative" },
  heroBanner:          { width: "100%" },
  heroPlaceholder:     { width: "100%", backgroundColor: C.cardBg, alignItems: "center", justifyContent: "center" },
  heroPlaceholderText: { fontSize: 80 },
  heroGradient:        { position: "absolute", bottom: 0, left: 0, right: 0, height: "70%" },
  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonTablet:  { top: 56, left: 24, width: 44, height: 44, borderRadius: 22 },
  omBadge: {
    position: "absolute",
    top: 48,
    right: 16,
    backgroundColor: "rgba(218,165,32,0.15)",
    borderRadius: 22,
    padding: 8,
    borderWidth: 1,
    borderColor: C.gold,
  },
  omBadgeTablet:     { top: 56, right: 24, padding: 12, borderRadius: 28 },
  omText:            { fontSize: 20 },
  omTextTablet:      { fontSize: 26 },

  titleBlock:        { marginTop: -8, paddingTop: 8, paddingBottom: 20 },
  titleMain:         { fontSize: 18, fontWeight: "900", color: C.white, letterSpacing: 0.2, marginBottom: 6 },
  titleMainTablet:   { fontSize: 25 },
  titleSub:          { fontSize: 15, color: C.textSub, fontWeight: "500", marginBottom: 14 },
  titleSubTablet:    { fontSize: 18 },
  goldBar:           { width: 40, height: 3, backgroundColor: C.gold, borderRadius: 2, marginTop: 2, marginBottom: 20 },

  tabBar:            { flexDirection: "row", gap: 28 },
  tabItem:           { paddingBottom: 10, position: "relative" },
  tabText:           { fontSize: 13, fontWeight: "700", color: C.textSub, letterSpacing: 1 },
  tabTextActive:     { color: C.gold },
  tabUnderline:      { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, backgroundColor: C.gold, borderRadius: 1 },

  divider:           { height: 1, backgroundColor: C.divider, marginBottom: 20 },

  lyricsBlock:       { paddingBottom: 8, alignItems: "center" },
  lyricLine: {
    fontSize: 16, lineHeight: 28, color: "#d4c4b0",
    textAlign: "center", fontWeight: "500",
  },
  lyricLineTablet:   { fontSize: 18, lineHeight: 32 },
  readMoreBtn:       { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 16 },
  readMoreText:      { fontSize: 12, fontWeight: "800", color: C.gold, letterSpacing: 0.8 },

  galleryList:       { paddingBottom: 4 },
  galleryItem:       { marginRight: 14 },
  galleryImageWrap:  { borderRadius: 10, overflow: "hidden", borderWidth: 1.5, borderColor: "rgba(218,165,32,0.35)", backgroundColor: C.cardBg, position: "relative" },
  galleryGradient:   { position: "absolute", bottom: 0, left: 0, right: 0, height: 55 },
  galleryBadge:      { position: "absolute", top: 7, left: 7, backgroundColor: "rgba(26,10,0,0.75)", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: "rgba(218,165,32,0.4)" },
  galleryBadgeText:  { fontSize: 10, fontWeight: "800", color: C.gold, letterSpacing: 0.4 },
  galleryCaption:    { marginTop: 7, fontSize: 12, color: C.textSub, fontWeight: "600", textAlign: "center" },

  footer:            { flexDirection: "row", alignItems: "center" },
  footerLine:        { flex: 1, height: 1, backgroundColor: C.gold, opacity: 0.2 },
  footerOmWrap:      { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(218,165,32,0.08)", borderWidth: 1, borderColor: "rgba(218,165,32,0.25)", alignItems: "center", justifyContent: "center", marginHorizontal: 14 },
  footerOm:          { fontSize: 24, color: C.gold, opacity: 0.6 },
});