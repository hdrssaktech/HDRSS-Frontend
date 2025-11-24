import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

export default function TownBusinessPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { town } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenInfo, setScreenInfo] = useState({
    width: 375,
    height: 667,
    isSmallDevice: false,
    isTablet: false,
    isLargeTablet: false
  });

  // Initialize dimensions safely
  useEffect(() => {
    const updateDimensions = () => {
      try {
        const window = Dimensions.get("window");
        const isSmallDevice = window.width < 375;
        const isTablet = window.width >= 768;
        const isLargeTablet = window.width >= 1024;
        
        setScreenInfo({
          width: window.width,
          height: window.height,
          isSmallDevice,
          isTablet,
          isLargeTablet
        });
      } catch (error) {
        console.log("Error getting dimensions, using defaults");
        setScreenInfo({
          width: 375,
          height: 667,
          isSmallDevice: false,
          isTablet: false,
          isLargeTablet: false
        });
      }
    };

    updateDimensions();

    const subscription = Dimensions.addEventListener('change', updateDimensions);

    return () => {
       subscription?.remove?.();
    };
  }, []);

  // Fetch categories for the selected town
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/tb/business/category/${town.id}`
        );
        const json = await response.json();
        console.log("API RESPONSEs:", json);
        setData(json|| []);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [town.id]);

  // Grid layout calculation for 2/2 layout
  const getGridColumns = () => {
    if (screenInfo.isLargeTablet) return 4; // 4 columns on large tablets
    if (screenInfo.isTablet) return 3; // 3 columns on tablets
    if (screenInfo.width >= 400) return 2; // 2 columns on larger phones
    return 2; // 2 columns on most phones
  };

  const gridColumns = getGridColumns();

  // Calculate card width dynamically
  const getCardWidth = () => {
    const containerPadding = 32; // 16px on each side
    const totalGap = (gridColumns - 1) * 12; // 12px gap between items
    return (screenInfo.width - containerPadding - totalGap) / gridColumns;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Enhanced Header Banner */}
      <View style={[
        styles.bannerContainer,
        { 
          height: screenInfo.isLargeTablet ? 400 : 
                 screenInfo.isTablet ? 320 : 
                 screenInfo.isSmallDevice ? 200 : 280 
        }
      ]}>
        <Image
          source={{ uri: town.bannerImage }}
          style={styles.banner}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.6, 1]}
          style={styles.gradientOverlay}
        />
        
        {/* Back Button */}
        <TouchableOpacity
          style={[
            styles.backButton,
            screenInfo.isTablet && styles.tabletBackButton
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="chevron-back" 
            size={screenInfo.isTablet ? 32 : 28} 
            color="#fff" 
          />
        </TouchableOpacity>

        {/* Enhanced Header Content */}
        <View style={[
          styles.headerContent,
          screenInfo.isTablet && styles.tabletHeaderContent
        ]}>
          <View style={styles.titleContainer}>
            <Text style={[
              styles.townName,
              screenInfo.isLargeTablet && styles.largeTabletTownName,
              screenInfo.isTablet && styles.tabletTownName,
              screenInfo.isSmallDevice && styles.smallTownName
            ]}>
              {town.townname}
            </Text>
            <View style={styles.divider} />
            <Text style={[
              styles.subtitle,
              screenInfo.isTablet && styles.tabletSubtitle,
              screenInfo.isSmallDevice && styles.smallSubtitle
            ]}>
              Discover Local Businesses
            </Text>
          </View>
          
          {/* Stats Bar */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{data.length}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Businesses</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Enhanced Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#93210A" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : data.length > 0 ? (
          <View style={styles.categoriesContainer}>
            {/* Enhanced Header */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[
                  styles.categoriesTitle,
                  screenInfo.isTablet && styles.tabletCategoriesTitle,
                  screenInfo.isSmallDevice && styles.smallCategoriesTitle
                ]}>
                  Explore Categories
                </Text>
                <Text style={[
                  styles.categoriesSubtitle,
                  screenInfo.isTablet && styles.tabletCategoriesSubtitle
                ]}>
                  Find the best local businesses in {town.townname}
                </Text>
              </View>
              {/* <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{data.length}</Text>
              </View> */}
            </View>

            {/* Enhanced Grid Layout for 2/2 Categories */}
            <View style={[
              styles.categoriesGrid,
              { 
                gap: screenInfo.isLargeTablet ? 16 : 
                     screenInfo.isTablet ? 14 : 12 
              }
            ]}>
              {data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryCard,
                    { 
                      width: getCardWidth(),
                      height: screenInfo.isLargeTablet ? 200 :
                             screenInfo.isTablet ? 180 :
                             screenInfo.isSmallDevice ? 150 : 170
                    },
                    screenInfo.isLargeTablet && styles.largeTabletCategoryCard,
                    screenInfo.isTablet && styles.tabletCategoryCard
                  ]}
                  onPress={() =>
                    navigation.navigate("TownBusiness2", { subcategoryId: item.id })
                  }
                  activeOpacity={0.9}
                >
                  {/* Image Container */}
                  <View style={[
                    styles.categoryImageContainer,
                    {
                      height: screenInfo.isLargeTablet ? 120 :
                             screenInfo.isTablet ? 100 :
                             screenInfo.isSmallDevice ? 80 : 90
                    }
                  ]}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.categoryImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.5)']}
                      style={styles.cardGradient}
                    />
                    
                    {/* Category Badge */}
                    <View style={styles.categoryBadge}>
                      <Ionicons name="business" size={
                        screenInfo.isLargeTablet ? 14 :
                        screenInfo.isTablet ? 12 : 10
                      } color="#fff" />
                    </View>
                  </View>
                  
                  {/* Content */}
                  <View style={[
                    styles.categoryContent,
                    {
                      padding: screenInfo.isLargeTablet ? 12 :
                              screenInfo.isTablet ? 10 : 8
                    }
                  ]}>
                    <Text 
                      style={[
                        styles.categoryTitle,
                        screenInfo.isLargeTablet && styles.largeTabletCategoryTitle,
                        screenInfo.isTablet && styles.tabletCategoryTitle,
                        screenInfo.isSmallDevice && styles.smallCategoryTitle
                      ]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text 
                      style={[
                        styles.categoryDescription,
                        screenInfo.isLargeTablet && styles.largeTabletCategoryDescription,
                        screenInfo.isTablet && styles.tabletCategoryDescription,
                        screenInfo.isSmallDevice && styles.smallCategoryDescription
                      ]}
                      numberOfLines={2}
                    >
                      {item.description || "Explore local businesses"}
                    </Text>
                    
                    {/* Footer */}
                    <View style={styles.cardFooter}>
                      <View style={[
                        styles.exploreButton,
                        screenInfo.isSmallDevice && styles.smallExploreButton
                      ]}>
                        <Text style={[
                          styles.exploreText,
                          screenInfo.isSmallDevice && styles.smallExploreText
                        ]}>
                          Explore
                        </Text>
                        <Ionicons 
                          name="arrow-forward" 
                          size={
                            screenInfo.isLargeTablet ? 14 :
                            screenInfo.isTablet ? 13 : 12
                          } 
                          color="#93210A" 
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          // Enhanced Empty State
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <Ionicons name="business-outline" size={120} color="#e0e0e0" />
              <View style={styles.emptyBadge}>
                <Ionicons name="alert-circle" size={24} color="#93210A" />
              </View>
            </View>
            <Text style={styles.emptyTitle}>No Categories Available</Text>
            <Text style={styles.emptyText}>
              We're working on bringing business categories to {town.townname}. 
              Check back soon for updates!
            </Text>
            <TouchableOpacity style={styles.retryButton}>
              <Text style={styles.retryText}>Notify Me</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  // Enhanced Banner Section
  bannerContainer: {
    position: "relative",
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 10,
    zIndex: 2,
  },
  tabletBackButton: {
    top: 50,
    left: 30,
    padding: 12,
    borderRadius: 16,
  },
  headerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 40,
  },
  tabletHeaderContent: {
    padding: 32,
    paddingTop: 50,
  },
  titleContainer: {
    marginBottom: 20,
  },
  townName: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  largeTabletTownName: {
    fontSize: 42,
  },
  tabletTownName: {
    fontSize: 36,
  },
  smallTownName: {
    fontSize: 26,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#93210A",
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  tabletSubtitle: {
    fontSize: 18,
  },
  smallSubtitle: {
    fontSize: 14,
  },
  
  // Stats Bar
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 20,
  },

  // Content Area
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Loading State
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

  // Enhanced Categories Section
  categoriesContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  categoriesTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tabletCategoriesTitle: {
    fontSize: 32,
  },
  smallCategoriesTitle: {
    fontSize: 24,
  },
  categoriesSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  tabletCategoriesSubtitle: {
    fontSize: 18,
  },
  counterBadge: {
    backgroundColor: "#93210A",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Enhanced Grid Layout for 2/2
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  // Enhanced Category Cards for 2/2 layout
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 12,
  },
  tabletCategoryCard: {
    borderRadius: 18,
  },
  largeTabletCategoryCard: {
    borderRadius: 20,
  },
  categoryImageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(147, 33, 10, 0.9)",
    borderRadius: 8,
    padding: 4,
  },
  categoryContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 18,
  },
  largeTabletCategoryTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  tabletCategoryTitle: {
    fontSize: 15,
    lineHeight: 19,
  },
  smallCategoryTitle: {
    fontSize: 13,
    lineHeight: 16,
  },
  categoryDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 8,
  },
  largeTabletCategoryDescription: {
    fontSize: 13,
    lineHeight: 17,
  },
  tabletCategoryDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  smallCategoryDescription: {
    fontSize: 11,
    lineHeight: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147, 33, 10, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  smallExploreButton: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  exploreText: {
    color: "#93210A",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  smallExploreText: {
    fontSize: 11,
    marginRight: 3,
  },

  // Enhanced Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyIllustration: {
    position: "relative",
    marginBottom: 32,
  },
  emptyBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: "#93210A",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});