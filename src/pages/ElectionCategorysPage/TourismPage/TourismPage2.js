import React, { useEffect, useState ,useMemo} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  useWindowDimensions,
  Linking,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchTourismByType } from "../../../Controller/TourismController/TourismController";
import Loader from "../../../components/Alert/Loader";

export default function TourismPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { typeId, typeName } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // Responsive size helper
  const responsiveSize = (mobile, tablet, largeTablet) => {
    if (isLargeTablet) return largeTablet || tablet;
    return isTablet ? tablet : mobile;
  };

  // Responsive columns: 2 on mobile, 3 on tablet, 4 on large tablet
  const numColumns = isLargeTablet ? 4 : (isTablet ? 3 : 2);

  // Calculate card width based on screen size
  const cardWidth = useMemo(() => {
    const padding = responsiveSize(10, 15, 20);
    const gap = responsiveSize(10, 15, 20);
    const totalGap = gap * (numColumns - 1);
    const availableWidth = width - (padding * 2);
    return (availableWidth - totalGap) / numColumns;
  }, [width, numColumns, isTablet, isLargeTablet]);

  /* ===================== API ===================== */
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchTourismByType(typeId);
        setPlaces(data);
        setFilteredPlaces(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, [typeId]);

  /* ===================== SEARCH ===================== */
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredPlaces(places);
      return;
    }
    setFilteredPlaces(
      places.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* ===================== HEADER ===================== */}
      <View style={[
        styles.header, 
        isTablet && styles.headerTablet,
        isLargeTablet && styles.headerLargeTablet
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            isTablet && styles.backButtonTablet
          ]}
        >
          <Ionicons 
            name="chevron-back" 
            size={responsiveSize(24, 28, 32)} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <Text style={[
          styles.headerTitle, 
          isTablet && styles.headerTitleTablet
        ]}>
          {typeName}
        </Text>
        
        <View style={[
          styles.headerSpacer,
          isTablet && styles.headerSpacerTablet
        ]} />
      </View>

      {/* ===================== SEARCH ===================== */}
      <View style={[
        styles.searchContainer,
        isTablet && styles.searchContainerTablet
      ]}>
        <Ionicons 
          name="search" 
          size={responsiveSize(18, 20, 22)} 
          color="#777" 
        />
        <TextInput
          placeholder="Search places..."
          value={searchText}
          onChangeText={handleSearch}
          style={[
            styles.searchInput,
            isTablet && styles.searchInputTablet
          ]}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons 
              name="close" 
              size={responsiveSize(18, 20, 22)} 
              color="#777" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ===================== GRID ===================== */}
      <FlatList
        data={filteredPlaces}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.list,
          isTablet && styles.listTablet
        ]}
        columnWrapperStyle={[
          styles.columnWrapper,
          { 
            justifyContent: "space-between",
            marginBottom: responsiveSize(12, 16, 20)
          }
        ]}
        ListEmptyComponent={
          <View style={[
            styles.notFound,
            isTablet && styles.notFoundTablet
          ]}>
            <Ionicons 
              name="search-outline" 
              size={responsiveSize(50, 70, 90)} 
              color="#ccc" 
            />
            <Text style={[
              styles.notFoundText,
              isTablet && styles.notFoundTextTablet
            ]}>
              No places found
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { width: cardWidth },
              isTablet && styles.cardTablet
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("TourismPage3", { id: item.id })
            }
          >
            <Image
              source={{
                uri:
                  item.bannerImage ||
                  "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
              }}
              style={[
                styles.image,
                isTablet && styles.imageTablet
              ]}
            />

            <View style={[
              styles.info,
              isTablet && styles.infoTablet
            ]}>
              <Text style={[
                styles.name,
                isTablet && styles.nameTablet
              ]} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={[
                styles.title,
                isTablet && styles.titleTablet
              ]} numberOfLines={2}>
                {item.title}
              </Text>

              {/* ===================== BUTTONS ===================== */}
              <View style={[
                styles.buttonRow,
                isTablet && styles.buttonRowTablet
              ]}>
                <TouchableOpacity
                  style={[
                    styles.visitButton,
                    isTablet && styles.visitButtonTablet
                  ]}
                  onPress={() =>
                    navigation.navigate("TourismPlaces", { id: item.id })
                  }
                >
                  <Ionicons 
                    name="location-outline" 
                    size={responsiveSize(16, 18, 20)} 
                    color="#fff" 
                  />
                  <Text style={[
                    styles.btnText,
                    isTablet && styles.btnTextTablet
                  ]}>
                    Visit
                  </Text>
                </TouchableOpacity>

                {item.phone && (
                  <TouchableOpacity
                    style={[
                      styles.callButton,
                      isTablet && styles.callButtonTablet
                    ]}
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                  >
                    <Ionicons 
                      name="call-outline" 
                      size={responsiveSize(18, 20, 22)} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Header Styles
  header: {
   flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
   paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  headerLargeTablet: {
    paddingTop: StatusBar.currentHeight + 25,
    paddingBottom: 24,
    paddingHorizontal: 32,
  },
  backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 22,
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 34,
  },
  headerSpacerTablet: {
    width: 44,
  },

  // Search Container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  searchContainerTablet: {
    margin: 20,
    marginHorizontal: 24,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },
  searchInputTablet: {
    paddingVertical: 15,
    fontSize: 16,
  },

  // List Styles
  list: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  listTablet: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },

  // Card Styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    height: 100,
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  imageTablet: {
    height: 130,
  },

  // Info Section
  info: {
    padding: 8,
  },
  infoTablet: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  },
  nameTablet: {
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: "#666",
    marginVertical: 2,
    lineHeight: 16,
  },
  titleTablet: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Button Row
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  buttonRowTablet: {
    marginTop: 12,
  },
  visitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  visitButtonTablet: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  callButton: {
    backgroundColor: "#93210A",
    padding: 8,
    borderRadius: 50,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  callButtonTablet: {
    width: 44,
    height: 44,
    padding: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
    fontWeight: "600",
  },
  btnTextTablet: {
    fontSize: 14,
    marginLeft: 6,
  },

  // Empty State
  notFound: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  notFoundTablet: {
    marginTop: 80,
  },
  notFoundText: {
    color: "#999",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  notFoundTextTablet: {
    fontSize: 18,
    marginTop: 16,
  },
});