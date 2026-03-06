import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMembers } from "../../api/api";
import Loader from "../../components/Alert/Loader";

// ✅ Custom hook for responsive design
const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;
  const isLandscape = width > height;

  // Responsive grid columns
  const numColumns = isTablet ? (isLargeTablet ? 3 : 2) : 2;
  
  // Card width calculation
  const cardWidth = isTablet 
    ? isLargeTablet 
      ? (width - 80) / 3  
      : (width - 64) / 2   // 2 columns with spacing
    : (width - 48) / 2;    // 2 columns on mobile

  // Responsive sizes
  const sizes = {
    // Header
    headerHeight: isTablet ? (isLargeTablet ? 140 : 120) : 100,
    headerTitleSize: isTablet ? (isLargeTablet ? 31 : 28) : 20,
    headerIconSize: isTablet ? 32 : 26,
    headerTopPadding: isTablet ? (Platform.OS === 'ios' ? 60 : 50) : (Platform.OS === 'ios' ? 50 : 40),
    
    // Cards
    imageSize: isTablet ? (isLargeTablet ? 150 : 130) : 100,
    nameSize: isTablet ? (isLargeTablet ? 22 : 20) : 16,
    categorySize: isTablet ? (isLargeTablet ? 18 : 16) : 14,
    detailSize: isTablet ? (isTablet ? 16 : 14) : 13,
    
    // Join Button
    joinButtonPadding: isTablet ? (isLargeTablet ? 18 : 16) : 12,
    joinButtonWidth: isTablet ? (isLargeTablet ? 300 : 250) : 200,
    joinButtonFontSize: isTablet ? (isLargeTablet ? 22 : 20) : 16,
    
    // Spacing
    cardPadding: isTablet ? (isLargeTablet ? 20 : 16) : 10,
    cardMargin: isTablet ? (isLargeTablet ? 12 : 10) : 8,
    containerPadding: isTablet ? (isLargeTablet ? 24 : 20) : 10,
    gap: isTablet ? (isLargeTablet ? 20 : 16) : 12,
  };

  return {
    isTablet,
    isLargeTablet,
    isLandscape,
    numColumns,
    cardWidth,
    sizes,
    width,
    height,
  };
};

export default function Membership() {
  const navigation = useNavigation();
  const route = useRoute();
  const responsive = useResponsive();
  const { categoryType, districtId, districtName } = route.params || {};

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();

        // Filter based on category type
        const filtered = data.filter(
          (m) => m.categoryType.toLowerCase() === categoryType?.toLowerCase()
        );

        setMembers(filtered);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [categoryType, districtName]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to member details if needed
        // navigation.navigate("MemberDetails", { memberId: item.id });
      }}
      style={[
        styles.card,
        {
          width: responsive.cardWidth,
          padding: responsive.sizes.cardPadding,
          marginBottom: responsive.sizes.gap,
        },
        responsive.isTablet && styles.cardTablet,
        responsive.isLargeTablet && styles.cardLargeTablet,
        index % responsive.numColumns !== responsive.numColumns - 1 && {
          marginRight: responsive.sizes.gap,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/150",
          }}
          style={[
            styles.image,
            {
              width: responsive.sizes.imageSize,
              height: responsive.sizes.imageSize,
              borderRadius: responsive.sizes.imageSize / 2,
            },
          ]}
        />
        {item.isActive && (
          <View style={[
            styles.activeBadge,
            { right: responsive.isTablet ? 5 : 0 }
          ]}>
            <View style={styles.activeDot} />
          </View>
        )}
      </View>

      <Text 
        style={[
          styles.name,
          { fontSize: responsive.sizes.nameSize }
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.name || "Name"}
      </Text>

      {item.designation && (
        <Text 
          style={[
            styles.detail,
            { fontSize: responsive.sizes.detailSize }
          ]}
          numberOfLines={1}
        >
          {item.designation}
        </Text>
      )}

      <Text 
        style={[
          styles.category,
          { fontSize: responsive.sizes.categorySize }
        ]}
      >
        {item.categoryType}
      </Text>

      {item.phoneNumber && (
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call-outline" size={responsive.isTablet ? 22 : 18} color="#93210A" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[
      styles.header,
      {
        paddingTop: responsive.sizes.headerTopPadding,
        paddingBottom: responsive.isTablet ? 25 : 20,
        paddingHorizontal: responsive.sizes.containerPadding,
      }
    ]}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={[
          styles.backButton,
          responsive.isTablet && styles.backButtonTablet
        ]}
      >
        <Ionicons 
          name="chevron-back" 
          size={responsive.sizes.headerIconSize} 
          color="#fff" 
        />
      </TouchableOpacity>
      
      <Text style={[
        styles.headerText,
        { fontSize: responsive.sizes.headerTitleSize }
      ]}>
        {categoryType === "State" ? "State Leaders" : "District Leaders"}
        {districtName && ` - ${districtName}`}
      </Text>
      
      <View style={styles.headerRight} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#93210A" barStyle="light-content" />
        {renderHeader()}
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {renderHeader()}

      <View style={[
        styles.content,
        { paddingHorizontal: responsive.sizes.containerPadding }
      ]}>
        <FlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={responsive.numColumns}
          key={`${responsive.numColumns}_${responsive.width}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: responsive.isTablet ? 120 : 100 }
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="people-outline" 
                size={responsive.isTablet ? 80 : 60} 
                color="#ccc" 
              />
              <Text style={[
                styles.emptyText,
                { fontSize: responsive.isTablet ? 20 : 16 }
              ]}>
                No members found
              </Text>
            </View>
          }
        />

        {/* Join Button - Fixed at bottom */}
        <View style={[
          styles.footer,
          {
            paddingBottom: responsive.isTablet ? 30 : 20,
            paddingHorizontal: responsive.sizes.containerPadding,
          }
        ]}>
          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                width: responsive.sizes.joinButtonWidth,
                paddingVertical: responsive.sizes.joinButtonPadding,
                borderRadius: responsive.isTablet ? 35 : 25,
              }
            ]}
            onPress={() => navigation.navigate("Member1", { districtName })}
          >
            <Ionicons 
              name="person-add-outline" 
              size={responsive.sizes.joinButtonFontSize} 
              color="#fff" 
              style={styles.joinIcon}
            />
            <Text style={[
              styles.joinButtonText,
              { fontSize: responsive.sizes.joinButtonFontSize }
            ]}>
              Join With Us
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },

  headerText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  headerRight: {
    width: 40,
  },

  content: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  listContent: {
    paddingTop: 20,
  },

  // Card Styles
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTablet: {
    borderRadius: 20,
    elevation: 5,
    shadowRadius: 6,
  },
  cardLargeTablet: {
    borderRadius: 24,
    elevation: 6,
    shadowRadius: 8,
  },

  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },

  image: {
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: "#fff",
  },

  activeBadge: {
    position: "absolute",
    bottom: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },

  name: {
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginTop: 4,
  },

  detail: {
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },

  category: {
    color: "#93210A",
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },

  callButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(147,33,10,0.1)",
    borderRadius: 20,
    padding: 6,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },

  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93210A",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  joinIcon: {
    marginRight: 8,
  },

  joinButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyText: {
    color: "#999",
    fontWeight: "600",
    marginTop: 12,
  },
});