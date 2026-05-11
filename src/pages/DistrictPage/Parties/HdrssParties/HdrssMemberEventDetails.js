import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform, FlatList, Dimensions } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const HDRSSMembereventsdetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { event } = route.params || {};

    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videos, setVideos] = useState([]);

    // Responsive design
    const isTablet = useMemo(() => {
        return width >= 768 || (width > height && width >= 600);
    }, [width, height]);

    useEffect(() => {
        if (event) {
            extractVideos();
        }
    }, [event]);

    if (!event) {
        return (
            <SafeAreaView style={styles.safe}>
                <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={isTablet ? 60 : 50} color="#8B0000" />
                    <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>No event data found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    // Extract YouTube Video ID from URL
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Extract videos from event data
    const extractVideos = () => {
        let videoItems = [];
        
        if (event.videos && Array.isArray(event.videos) && event.videos.length > 0) {
            videoItems = [...videoItems, ...event.videos];
        }
        
        const singleVideoFields = [
            'video', 'videoUrl', 'video_url', 'videoURL',
            'youtube', 'youtubeUrl', 'youtube_url', 'youtubeURL',
            'youtubeLink', 'youtube_link', 'videoLink', 'video_link'
        ];
        
        singleVideoFields.forEach(field => {
            if (event[field] && typeof event[field] === 'string') {
                videoItems.push({ 
                    url: event[field], 
                    title: event[`${field}_title`] || event.title || 'Event Video' 
                });
            }
        });
        
        const processedVideos = videoItems.map((item, index) => {
            const videoUrl = item.url || item.videoUrl || item.video || item.video_url || item;
            const youtubeId = getYouTubeId(videoUrl);
            
            return {
                id: item.id || `video-${index}`,
                thumbnail: item.thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
                title: item.title || item.name || `Video ${index + 1}`,
                youtubeId: youtubeId,
                url: videoUrl,
                isPlaying: false
            };
        }).filter(video => video.youtubeId);
        
        setVideos(processedVideos);
    };

    // Safe gallery images
    const galleryImages = event.gallery && Array.isArray(event.gallery) && event.gallery.length > 0 
        ? event.gallery.map((item, index) => ({
            ...item,
            id: item.id || `gallery-${index}`,
            url: item.url || item.image || event.image
          }))
        : (event.image ? [{ id: 'default-gallery', url: event.image }] : []);

    const renderGalleryItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.galleryItem, isTablet && styles.galleryItemTablet]}
            onPress={() => {
                console.log('Open image:', item.url);
            }}
        >
            <Image source={{ uri: item.url }} style={styles.galleryImage} />
            <View style={styles.galleryOverlay}>
                <Ionicons name="eye-outline" size={isTablet ? 24 : 20} color="#fff" />
            </View>
        </TouchableOpacity>
    );

    const renderVideoItem = ({ item }) => {
        const isPlaying = selectedVideo === item.id;
        
        return (
            <View style={[styles.videoItem, isTablet && styles.videoItemTablet]}>
                {isPlaying ? (
                    <View style={[styles.videoPlayerContainer, isTablet && styles.videoPlayerContainerTablet]}>
                        <WebView
                            style={styles.inlineVideoPlayer}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            allowsFullscreenVideo={true}
                            source={{ uri: `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1` }}
                        />
                        <TouchableOpacity 
                            style={styles.closeVideoButton}
                            onPress={() => setSelectedVideo(null)}
                        >
                            <Ionicons name="close-circle" size={isTablet ? 40 : 32} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={[styles.videoThumbnailContainer, isTablet && styles.videoThumbnailContainerTablet]}
                        onPress={() => setSelectedVideo(item.id)}
                    >
                        <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
                        <View style={[styles.playButton, isTablet && styles.playButtonTablet]}>
                            <Ionicons name="play-circle" size={isTablet ? 80 : 60} color="#8B0000" />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
            
            {/* Header Section - Centered Title */}
            <View style={[styles.headerContainer, isTablet && styles.headerContainerTablet]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={[styles.backButton, isTablet && styles.backButtonTablet]}
                >
                    <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.headerContent}>
                    <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>Event Details</Text>
                </View>
                
                <View style={[styles.placeholder, isTablet && styles.placeholderTablet]} />
            </View>

            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
            >
                {/* Event Image */}
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: event.image || "https://via.placeholder.com/400x250/f0f0f0/8B0000?text=Event" }}
                        style={[styles.image, isTablet && styles.imageTablet]}
                        resizeMode="cover"
                    />
                    {event.time && (
                        <View style={[styles.timeBadge, isTablet && styles.timeBadgeTablet]}>
                            <Ionicons name="time-outline" size={isTablet ? 16 : 14} color="#fff" />
                            <Text style={[styles.timeText, isTablet && styles.timeTextTablet]}>{event.time}</Text>
                        </View>
                    )}
                    {event.eventType && (
                        <View style={[styles.eventTypeBadge, isTablet && styles.eventTypeBadgeTablet]}>
                            <Text style={[styles.eventTypeText, isTablet && styles.eventTypeTextTablet]}>{event.eventType}</Text>
                        </View>
                    )}
                </View>

                {/* Event Title */}
                <Text style={[styles.title, isTablet && styles.titleTablet]}>{event.title || 'Event Title'}</Text>

                {/* Date and Location Row */}
                <View style={[styles.infoRow, isTablet && styles.infoRowTablet]}>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={isTablet ? 20 : 18} color="#8B0000" />
                        {/* <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>{formatDate(event.date)}</Text> */}
                    </View>
                    <View style={[styles.divider, isTablet && styles.dividerTablet]} />
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={isTablet ? 20 : 18} color="#8B0000" />
                        <Text style={[styles.infoText, isTablet && styles.infoTextTablet]} numberOfLines={1}>
                            {/* {event.location || 'Location TBD'} */}
                        </Text>
                    </View>
                </View>

                {/* Description Section */}
                {event.description && (
                    <View style={[styles.descriptionBox, isTablet && styles.descriptionBoxTablet]}>
                        <Text style={[styles.maroonHeading, isTablet && styles.maroonHeadingTablet]}>About Event</Text>
                        <Text style={[styles.description, isTablet && styles.descriptionTablet]}>
                            {event.description}
                        </Text>
                    </View>
                )}

                {/* Videos Section */}
                {videos.length > 0 && (
                    <View style={[styles.videosSection, isTablet && styles.videosSectionTablet]}>
                        <Text style={[styles.maroonHeading, isTablet && styles.maroonHeadingTablet]}>Videos</Text>
                        {videos.map((video) => (
                            <View key={video.id}>
                                {renderVideoItem({ item: video })}
                            </View>
                        ))}
                    </View>
                )}

                {/* Gallery Section */}
                {galleryImages.length > 0 && (
                    <View style={[styles.gallerySection, isTablet && styles.gallerySectionTablet]}>
                        <Text style={[styles.maroonHeading, isTablet && styles.maroonHeadingTablet]}>Gallery</Text>
                        <FlatList
                            data={galleryImages}
                            renderItem={renderGalleryItem}
                            keyExtractor={(item) => item.id || Math.random().toString()}
                            numColumns={isTablet ? 3 : 2}
                            scrollEnabled={false}
                            contentContainerStyle={[styles.galleryGrid, isTablet && styles.galleryGridTablet]}
                        />
                    </View>
                )}

                {/* Footer Space */}
                <View style={{ height: isTablet ? 40 : 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HDRSSMembereventsdetails;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
       
    },
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    scrollContentTablet: {
        paddingBottom: 30,
    },
    
    // Header Styles
    headerContainer: {
        backgroundColor: "#8B0000",
        paddingTop: Platform.OS === "ios" ? 50 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    headerContainerTablet: {
        paddingTop: Platform.OS === "ios" ? 60 : 50,
        paddingBottom: 25,
        paddingHorizontal: 32,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    backButtonTablet: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerContent: {
        alignItems: "center",
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        letterSpacing: 1,
    },
    headerTitleTablet: {
        fontSize: 26,
    },
    headerUnderline: {
        width: 40,
        height: 2,
        backgroundColor: "#fff",
        marginTop: 5,
        borderRadius: 1,
    },
    headerUnderlineTablet: {
        width: 50,
        height: 3,
        marginTop: 8,
    },
    placeholder: {
        width: 40,
    },
    placeholderTablet: {
        width: 50,
    },
    
    // Image Section
    imageWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 240,
        backgroundColor: '#f5f5f5',
    },
    imageTablet: {
        height: 320,
    },
    timeBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B0000',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    timeBadgeTablet: {
        top: 20,
        left: 20,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 30,
    },
    timeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        marginLeft: 6,
        letterSpacing: 0.5,
    },
    timeTextTablet: {
        fontSize: 14,
        marginLeft: 8,
    },
    eventTypeBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    eventTypeBadgeTablet: {
        top: 20,
        right: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
    },
    eventTypeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    eventTypeTextTablet: {
        fontSize: 13,
    },
    
    // Title
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 16,
        marginBottom: 12,
        lineHeight: 30,
    },
    titleTablet: {
        fontSize: 28,
        marginHorizontal: 24,
        marginBottom: 16,
        lineHeight: 36,
    },
    
    // Info Row
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    infoRowTablet: {
        marginHorizontal: 24,
        marginBottom: 24,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
    },
    infoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 12,
    },
    dividerTablet: {
        height: 24,
        marginHorizontal: 16,
    },
    infoText: {
        fontSize: 12,
        color: '#555',
        marginLeft: 6,
        fontWeight: '500',
    },
    infoTextTablet: {
        fontSize: 14,
        marginLeft: 8,
    },
    
    // Description Box
    descriptionBox: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    descriptionBoxTablet: {
        marginHorizontal: 24,
        marginBottom: 20,
        padding: 20,
        borderRadius: 14,
    },
    maroonHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8B0000',
        marginBottom: 12,
    },
    maroonHeadingTablet: {
        fontSize: 22,
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        textAlign: 'justify',
    },
    descriptionTablet: {
        fontSize: 16,
        lineHeight: 26,
    },
    // Videos Section
    videosSection: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    videosSectionTablet: {
        marginHorizontal: 24,
        marginBottom: 20,
    },
    videoItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    videoItemTablet: {
        borderRadius: 14,
        marginBottom: 16,
    },
    videoThumbnailContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    videoThumbnailContainerTablet: {
        height: 280,
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    },
    playButton: {
        position: 'absolute',
        top: '35%',
        left: '42%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 40,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    playButtonTablet: {
        top: '38%',
        left: '44%',
        borderRadius: 50,
        padding: 15,
    },
    videoPlayerContainer: {
        position: 'relative',
        width: '100%',
        height: 220,
        backgroundColor: '#000',
    },
    videoPlayerContainerTablet: {
        height: 300,
    },
    inlineVideoPlayer: {
        width: '100%',
        height: '100%',
    },
    closeVideoButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        padding: 2,
    },
    
    // Gallery Section
    gallerySection: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    gallerySectionTablet: {
        marginHorizontal: 24,
        marginBottom: 20,
    },
    galleryGrid: {
        paddingBottom: 8,
    },
    galleryGridTablet: {
        paddingBottom: 12,
    },
    galleryItem: {
        flex: 1,
        margin: 4,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: 1,
        backgroundColor: '#f5f5f5',
    },
    galleryItemTablet: {
        margin: 6,
        borderRadius: 12,
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    galleryOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
    },
    
    // Error State
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#8B0000',
        fontWeight: '600',
    },
    errorTextTablet: {
        fontSize: 20,
        marginTop: 16,
    },
});