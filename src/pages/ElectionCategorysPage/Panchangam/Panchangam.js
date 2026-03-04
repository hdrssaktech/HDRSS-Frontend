// PanchangamHome.js
import React, { useMemo, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

// Professional color palette
const COLORS = {
  primary: "#8B0000",      // Dark red (header)
  secondary: "#1DBA63",    // Green (date card)
  accent: "#FFB28F",       // Peach
  text: "#212529",         // Dark gray
  textLight: "#6c757d",    // Medium gray
  white: "#ffffff",
  cardBg: "#ffffff",
  lightBg: "#f8f9fa",
  shadow: "#000000",
  tiles: {
    teal: "#67D7C3",
    tealDark: "#38BFA9",
    peach: "#FFB28F",
    peachDark: "#FF8556",
    blue: "#8BB8FF",
    blueDark: "#4A8CFF",
    purple: "#D8C6FF",
    purpleDark: "#7B61FF",
    lavender: "#9293cc",
    lavenderDark: "#252673",
  }
};

export default function Panchangam() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Device detection
  const isTablet = width >= 600;
  const isMobile = width < 768;
  const isLandscape = width > height;

  // Responsive calculations
  const getResponsiveValues = () => {
    if (isTablet) {
      return {
        gap: 20,
        horizontalPadding: 32,
        headerPaddingTop: Platform.OS === "ios" ? 70 : 60,
        headerTitleSize: 25,
        headerIconSize: 32,
        cardHeight: isLandscape ? 180 : 220,
        imageSize: isLandscape ? 50 : 70,
        dateTextSize: isLandscape ? 40 : 50,
        dayTextSize: isLandscape ? 24 : 25,
        tileHeight: isLandscape ? 200 : 240,
        tileIconSize: isLandscape ? 90 : 90,
        tileInnerIconSize: isLandscape ? 45 : 50,
        tileTextSize: isLandscape ? 20 : 20,
        tileDescriptionSize: isLandscape ? 14 : 14,
        listIconSize: isLandscape ? 28 : 32,
        listTitleSize: isLandscape ? 20 : 24,
        listDescSize: isLandscape ? 16 : 18,
      };
    } else {
      return {
        gap: 14,
        horizontalPadding: 14,
        headerPaddingTop: Platform.OS === "ios" ? 50 : 40,
        headerTitleSize: 19,
        headerIconSize: 25,
        cardHeight: 120,
        imageSize: 35,
        dateTextSize: 38,
        dayTextSize: 18,
        tileHeight: 120,
        tileIconSize: 50,
        tileInnerIconSize: 25,
        tileTextSize: 14,
        tileDescriptionSize: 12,
        listIconSize: 24,
        listTitleSize: 18,
        listDescSize: 14,
      };
    }
  };

  const responsive = getResponsiveValues();
  const TILE_W = (width - (responsive.horizontalPadding * 2) - responsive.gap) / 2;

  // Auto today date
  const today = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }, []);

  // Animation for rotating images
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const tiles = [
    {
      id: "1",
      title: "நாள் காட்டி",
      description: "தினசரி பஞ்சாங்கம்",
      bg: COLORS.tiles.teal,
      iconBg: COLORS.tiles.tealDark,
      icon: "calendar-today",
      screen: "NaalKaatiPanchangam",
    },
    {
      id: "2",
      title: "மாத காட்டி",
      description: "மாதாந்திர பஞ்சாங்கம்",
      bg: COLORS.tiles.peach,
      iconBg: COLORS.tiles.peachDark,
      icon: "calendar-month",
      screen: "MaathaKaatiPanchangam",
    },
    {
      id: "3",
      title: "முக்கிய தினங்கள்",
      description: "விசேஷ தினங்கள்",
      bg: COLORS.tiles.blue,
      iconBg: COLORS.tiles.blueDark,
      icon: "calendar-star",
      screen: "MukiyaThinangal",
    },
    {
      id: "4",
      title: "இன்றைய பஞ்சாங்கம்",
      description: "இன்றைய விஶேஷங்கள்",
      bg: COLORS.tiles.purple,
      iconBg: COLORS.tiles.purpleDark,
      icon: "zodiac-aries",
      screen: "IndraiyaPanchangam",
    },
    {
      id: "5",
      title: "கெளரி பஞ்சாங்கம்",
      description: "நேரங்காட்டி",
      bg: COLORS.tiles.lavender,
      iconBg: COLORS.tiles.lavenderDark,
      icon: "clock-outline",
      screen: "GowriPanchangam",
    },
  ];

  const handleNavigation = (screen) => {
    try {
      navigation.navigate(screen);
    } catch (error) {
      console.error(`Navigation error to ${screen}:`, error);
    }
  };

  // Responsive image positions
  const getImagePositions = () => {
    if (isTablet) {
      return [
        // LEFT SIDE
        { top: 30, left: 30 },
        { top: 100, left: 30 },
        { top: 170, left: 30 },
        // RIGHT SIDE
        { top: 30, right: 30 },
        { top: 100, right: 30 },
        { top: 170, right: 30 },
        // ADDITIONAL FOR TABLET
        { top: 65, left: 80 },
        { top: 135, right: 80 },
      ];
    } else {
      return [
        { top: 15, left: 9 },
        { top: 55, left: 9 },
        { top: 95, left: 9 },
        { top: 15, right: 10 },
        { top: 55, right: 10 },
        { top: 95, right: 10 },
      ];
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={[
        styles.header,
        {
          paddingTop: responsive.headerPaddingTop,
          paddingHorizontal: responsive.horizontalPadding,
          backgroundColor: COLORS.primary,
        }
      ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconBtn}
        >
          <Ionicons 
            name="arrow-back" 
            size={responsive.headerIconSize} 
            color={COLORS.white} 
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: responsive.headerTitleSize }]}>
          பஞ்சாங்கம்
        </Text>

        {isTablet && (
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={styles.headerIconBtn}
          >
            {/* <Ionicons
              name={viewMode === 'grid' ? 'list' : 'grid'}
              size={responsive.headerIconSize - 4}
              color={COLORS.white}
            /> */}
          </TouchableOpacity>
        )}
        {isMobile && <View style={styles.headerIconBtn} />}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { padding: responsive.horizontalPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Card */}
        <LinearGradient
          colors={[COLORS.secondary, "#0EA45C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.dateCard, { height: responsive.cardHeight }]}
        >
          <View style={styles.watermarkWrap}>
            <RotatingImages
              rotateAnim={rotateAnim}
              imagePositions={getImagePositions()}
              imageSize={responsive.imageSize}
              isTablet={isTablet}
            />
          </View>

          <View style={styles.dateTextWrap}>
            <Text style={[styles.dayText, { fontSize: responsive.dayTextSize }]}>
              இன்றைய தேதி
            </Text>
            <Text style={[styles.dateText, { fontSize: responsive.dateTextSize }]}>
              {today}
            </Text>
          </View>
        </LinearGradient>

        {/* View Mode Toggle for Tablet */}
        {isTablet && viewMode === 'list' && (
          <View style={styles.listHeader}>
           
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={styles.switchToGridBtn}
            >
              <Ionicons name="grid" size={20} color={COLORS.primary} />
              <Text style={styles.switchToGridText}>Grid View</Text>
            </TouchableOpacity>
          </View>
        )}

        {isTablet && viewMode === 'grid' && (
          <View style={styles.gridHeader}>
           
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={styles.switchToListBtn}
            >
              <Ionicons name="list" size={20} color={COLORS.primary} />
              <Text style={styles.switchToListText}>List View</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tiles - Grid or List View */}
        {viewMode === 'grid' ? (
          <View style={[styles.tileWrap, { gap: responsive.gap }]}>
            {tiles.map((t) => (
              <Tile
                key={t.id}
                title={t.title}
                description={t.description}
                bg={t.bg}
                iconBg={t.iconBg}
                icon={t.icon}
                onPress={() => handleNavigation(t.screen)}
                tileWidth={TILE_W}
                tileHeight={responsive.tileHeight}
                iconSize={responsive.tileIconSize}
                iconInnerSize={responsive.tileInnerIconSize}
                textSize={responsive.tileTextSize}
                descriptionSize={responsive.tileDescriptionSize}
                isTablet={isTablet}
              />
            ))}
          </View>
        ) : (
          <View style={styles.listWrap}>
            {tiles.map((t) => (
              <ListTile
                key={t.id}
                title={t.title}
                description={t.description}
                bg={t.bg}
                iconBg={t.iconBg}
                icon={t.icon}
                onPress={() => handleNavigation(t.screen)}
                isTablet={isTablet}
                iconSize={responsive.listIconSize}
                titleSize={responsive.listTitleSize}
                descSize={responsive.listDescSize}
              />
            ))}
          </View>
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
}

// Grid Tile Component
function Tile({
  title,
  description,
  bg,
  iconBg,
  icon,
  onPress,
  tileWidth,
  tileHeight,
  iconSize,
  iconInnerSize,
  textSize,
  descriptionSize,
  isTablet
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.tile,
        {
          backgroundColor: bg,
          width: tileWidth,
          height: tileHeight,
        }
      ]}
    >
      <View
        style={[
          styles.tileIconCircle,
          {
            backgroundColor: iconBg,
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
          }
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={iconInnerSize}
          color="#fff"
        />
      </View>
      <Text style={[styles.tileText, { fontSize: textSize }]}>
        {title}
      </Text>
      {isTablet && description && (
        <Text style={[styles.tileDescription, { fontSize: descriptionSize }]}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// List Tile Component for Tablet
function ListTile({ 
  title, 
  description, 
  bg, 
  iconBg, 
  icon, 
  onPress, 
  isTablet,
  iconSize,
  titleSize,
  descSize 
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.listTile, { backgroundColor: bg }]}
    >
      <View style={[styles.listIconCircle, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons 
          name={icon} 
          size={isTablet ? 32 : 24} 
          color="#fff" 
        />
      </View>
      <View style={styles.listContent}>
        <Text style={[styles.listTitle, { fontSize: titleSize }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.listDescription, { fontSize: descSize }]}>
            {description}
          </Text>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={isTablet ? 28 : 24} 
        color="#fff" 
      />
    </TouchableOpacity>
  );
}

// Rotating Images Component
function RotatingImages({ rotateAnim, imagePositions, imageSize, isTablet }) {
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      {imagePositions.map((pos, index) => (
        <Animated.Image
          key={index}
          source={require("../../../../assets/panchagam/panchagam.jpg")}
          style={[
            styles.rotatingImage,
            {
              ...(pos.left !== undefined ? { left: pos.left } : { right: pos.right }),
              top: pos.top,
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
              transform: [{ rotate: spin }],
              opacity: isTablet ? 0.15 : 0.2,
            },
          ]}
          resizeMode="cover"
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: COLORS.white,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  // Container
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },

  // Date Card
  dateCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  watermarkWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  rotatingImage: {
    position: "absolute",
  },
  dateTextWrap: {
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: "#EFFFF4",
    fontWeight: "700",
    marginBottom: 8,
  },
  dateText: {
    color: COLORS.white,
    fontWeight: "900",
    letterSpacing: 1,
  },

  // Grid Header
  gridHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  gridHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  switchToListBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  switchToListText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // List Header
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listHeaderTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  switchToGridBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  switchToGridText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // Grid View
  tileWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    paddingHorizontal: 8,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 0,
  },
  tileIconCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  tileText: {
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
  },
  tileDescription: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },

  // List View
  listWrap: {
    marginTop: 8,
  },
  listTile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  listIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  listDescription: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },

  // Tablet Footer
  tabletFooter: {
    marginTop: 24,
  },
  footerCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
  },
});