import React, { useEffect, useState,useRef  } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import TownPage1 from "./TownPage/TownPage1";
import { Linking } from "react-native"; 

const { width: screenWidth } = Dimensions.get("window");
const imageSize = screenWidth / 3 - 20;

export default function DistrictPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId } = route.params;

  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [playing, setPlaying] = useState(false);


   const adListRef = useRef(null);
  const adIndex = useRef(0);



  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const res = await fetch(
          (`https://hdrss-backend.onrender.com/api/districts/${districtId}`)
        );
        const data = await res.json();
        setDistrict(data);
      } catch (err) {
        console.error("❌ Error fetching district details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrict();
  }, [districtId]);




   // 🟢 Extract advertisement images safely
  const adImages = Array.isArray(district?.advertisementImages)
    ? district.advertisementImages
    : district?.advertisementImages?.image || [];

  // 🟢 Auto-scroll effect
  useEffect(() => {
    if (!adImages || adImages.length === 0) return;
    const scrollInterval = setInterval(() => {
      adIndex.current = (adIndex.current + 1) % adImages.length;
      if (adListRef.current) {
        adListRef.current.scrollToOffset({
          offset: adIndex.current * screenWidth, // scroll full screen width
          animated: true,
        });
      }
    }, 3000);
    return () => clearInterval(scrollInterval);
  }, [adImages]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  if (!district) {
    return (
      <View style={styles.center}>
        <Text>Failed to load district details.</Text>
      </View>
    );
  }

  const handleGovernmentPress = (districtId) => {
    navigation.navigate("GovernmentPage1", { districtId });
  };

  const handlepartiesPress = (districtId) => {
    navigation.navigate("Partiespage1", { districtId });
  };

  // 🏞 Separate places by category
  const tourismPlaces =
    district.places?.filter(
      (p) => p.category?.toLowerCase() === "tourism"
    ) || [];
  const templePlaces =
    district.places?.filter(
      (p) => p.category?.toLowerCase() === "temple"
    ) || [];

  // ✅ Extract YouTube video ID safely
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  };

  // ✅ Handle single or multiple video URLs from API
  const videoUrls = Array.isArray(district.videos)
    ? district.videos
    : district.videoUrl
    ? [district.videoUrl]
    : [];

  const videoIds = videoUrls
    .map((url) => getYouTubeId(url))
    .filter((id) => id !== null);

  return (
    <FlatList
      data={[{}]}
      keyExtractor={() => "content"}
      renderItem={() => (
        <ScrollView style={styles.container}>
          {/* 🖼 Banner */}
          <ImageBackground
            source={{
              uri:
                typeof district.bannerImage === "string"
                  ? district.bannerImage
                  : district.bannerImage?.url || district.image,
            }}
            style={styles.banner}
            resizeMode="cover"
          >
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() =>
                navigation.canGoBack()
                  ? navigation.goBack()
                  : navigation.navigate("DistrictPage1")
              }
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.overlay}>
              <Text style={styles.title}>{district.name}</Text>
            </View>
          </ImageBackground>

          {/* 📝 Description */}
          {district.description ? (
            <View style={{ margin: 15 }}>
              <Text style={styles.description}>
                {showFullDescription
                  ? district.description
                  : district.description.slice(0, 300) +
                    (district.description.length > 300 ? "..." : "")}
              </Text>

              {district.description.length > 300 && (
                <TouchableOpacity
                  style={styles.seeMoreContainer}
                  onPress={() => setShowFullDescription(!showFullDescription)}
                >
                  <Text style={styles.seeMoreText}>
                    {showFullDescription ? "See Less" : "See More"}
                  </Text>
                  <Ionicons
                    name={showFullDescription ? "chevron-up" : "chevron-forward"}
                    size={16}
                    color="#93210A"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : null}

         {/* 🆕 Full-screen centered Advertisement */}
          {adImages.length > 0 && (
            <View style={styles.section}>
              <FlatList
                ref={adListRef}
                data={adImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                  const imageUrl =
                    typeof item === "string"
                      ? item
                      : item?.url || item?.image || "";
                  return (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.adImage}
                      resizeMode="cover"
                    />
                  );
                }}
              />
            </View>
          )}


          {/* 📦 Menu Buttons */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuBox}
              onPress={() => handleGovernmentPress(districtId)}
            >
              <Text style={styles.menuText}>Government</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.menuBox}
            onPress={() =>
              navigation.navigate("Member0", {
                districtId: district.id,
                districtName: district.name,
              })
            }
          >
            <Text style={styles.menuText}>HDRSS</Text>
          </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuBox}
              onPress={() => handlepartiesPress(districtId)}
            >
              <Text style={styles.menuText}>Parties</Text>
            </TouchableOpacity>
          </View>

          {/* 🏙 Town */}
          <View>
            <TownPage1 />
          </View>

          {/* 📁 Extra Menu Buttons */}
          <View style={styles.Menucontainer}>
            <TouchableOpacity
              style={styles.menubutton}
              onPress={() => navigation.navigate("ComplainPage1",{
                districtId: district.id,
                districtName: district.name,
              })}
            >
              <Text style={styles.menubuttonText}>Complaint</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menubutton}
              onPress={() => navigation.navigate("Galleryfull")}
            >
              <Text style={styles.menubuttonText}>Gallery</Text>
            </TouchableOpacity>
          </View>

{/* 🏞 Tourism */}
{tourismPlaces.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Tourism</Text>
    <FlatList
      data={tourismPlaces.slice(0, 2)}
      nestedScrollEnabled
      keyExtractor={(item, i) => i.toString()}
      renderItem={({ item, index }) => {
        const isEven = index % 2 === 0;
        return (
          <TouchableOpacity
            style={[
              styles.tourismCard,
              { flexDirection: isEven ? "row" : "row-reverse" },
            ]}
            onPress={() =>
              navigation.navigate("DistrictCategorysPage2", {
                districtId,
                categoryName: "Tourism",
                placeId: item._id || item.id,
              })
            }
          >
            <Image
              source={{
                uri:
                  typeof item.image === "string"
                    ? item.image
                    : item.image?.url,
              }}
              style={styles.circleImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeDescription} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.iconRow}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}
                >
                  <Ionicons name="call" size={20} color="#0aa04dff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        item.location || ""
                      )}`
                    )
                  }
                >
                  <Ionicons
                    name="location-sharp"
                    size={20}
                    color="#ca0c0cff"
                    style={{ marginLeft: 15 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />

    {tourismPlaces.length > 2 && (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() =>
          navigation.navigate("DistrictCategorysPage1", {
            districtId,
            categoryName: "Tourism",
          })
        }
      >
        <Text style={styles.toggleButtonText}>See More</Text>
        <Ionicons name="chevron-forward" size={16} color="#93210A" />
      </TouchableOpacity>
    )}
  </View>
)}

{/* 🕌 Temples */}
{templePlaces.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Temples</Text>
    <FlatList
      data={templePlaces.slice(0, 2)}
      nestedScrollEnabled
      keyExtractor={(item, i) => i.toString()}
      renderItem={({ item, index }) => {
        const isEven = index % 2 === 0;
        return (
          <TouchableOpacity
            style={[
              styles.templeCard,
              { flexDirection: isEven ? "row" : "row-reverse" },
            ]}
            onPress={() =>
              navigation.navigate("DistrictCategorysPage2", {
                districtId,
                categoryName: "Temple",
                placeId: item._id || item.id,
              })
            }
          >
            <Image
              source={{
                uri:
                  typeof item.image === "string"
                    ? item.image
                    : item.image?.url,
              }}
              style={styles.circleImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeDescription} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.iconRow}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}
                >
                  <Ionicons name="call" size={20} color="#0aa04dff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        item.location || ""
                      )}`
                    )
                  }
                >
                  <Ionicons
                    name="location-sharp"
                    size={20}
                    color="#ca0c0cff"
                    style={{ marginLeft: 15 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />

    {templePlaces.length > 2 && (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() =>
          navigation.navigate("DistrictCategorysPage1", {
            districtId,
            categoryName: "Temple",
          })
        }
      >
        <Text style={styles.toggleButtonText}>See More</Text>
      </TouchableOpacity>
    )}
  </View>
)}



          {/* 🏢 Business Platform */}
          {district.places?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle1}>Business Platform</Text>
              <View style={styles.categoryRow}>
                {[
                  ...district.places.filter(
                    (place, index, self) =>
                      index ===
                        self.findIndex((p) => p.category === place.category) &&
                      place.category?.toLowerCase() !== "tourism" &&
                      place.category?.toLowerCase() !== "temple"
                  ),
                ].map((p, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.categoryPill}
                    onPress={() => {
                      const category = p.category?.toLowerCase();
                      if ( category === "restaurant") {
                        navigation.navigate("DistrictCategorysPage0", {
                          districtId: p.districtId,
                          categoryName: p.category,
                        });
                      } else {
                        navigation.navigate("DistrictCategorysPage1", {
                          districtId: p.districtId,
                          categoryName: p.category,
                        });
                      }
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          typeof p.image === "string"
                            ? p.image
                            : p.image?.url,
                      }}
                      style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryLabel}>{p.category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 🎥 District Video Section */}
          <View style={styles.videoContainer}>
            <Text style={styles.sectionTitle1}>District Videos</Text>
            {videoIds.length > 0 ? (
              videoIds.map((id, index) => (
                <View key={index} style={{ marginVertical: 30, right: 17 }}>
                  <YoutubePlayer
                    height={180}
                    width={370}
                    play={playing}
                    videoId={id}
                    onChangeState={(state) => setPlaying(state === "playing")}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noVideoText}>No video available</Text>
            )}
          </View>
        </ScrollView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 250, justifyContent: "flex-end" },
  arrowButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 6,
    zIndex: 999,
    elevation: 6,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.17)",
    width: "100%",
    height: "100%",
    paddingVertical: 80,
    position: "absolute",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    left: 75,
    bottom: 23,
  },
  description: {
    fontSize: 13,
    lineHeight: 22,
    color: "#333",
    textAlign: "justify",
  },
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
    marginRight: 10,
  },
  seeMoreText: {
    color: "#93210A",
    fontWeight: "bold",
    fontSize: 13,
  },
  section: { marginVertical: 10, alignItems: "center" },
adSection: {
  marginVertical: 15,
  backgroundColor: "#fff",
},
adWrapper: {
  width: screenWidth,
  alignItems: "center",
  justifyContent: "center",
},
adImage: {
  width: screenWidth,      // full edge-to-edge width
  height: 200,
  borderRadius: 0,         // no rounded corners (touches edges)
  backgroundColor: "#fff",
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 8,
  elevation: 10,
},

  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 8,
  },
  menuBox: {
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  Menucontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 15,
  },
  menubutton: {
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    justifyContent: "center",
  },
  menubuttonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  section: { marginTop: 20, marginBottom: 10 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    left: 140,
  },
tourismCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 14,
  marginVertical: 10,
  marginHorizontal: 16,
  padding: 14,
  borderWidth: 2,
  borderColor: "#8c8c8c", 
  elevation: 25,
  shadowColor: "#8B4513", 
  shadowOpacity: 0.7, 
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 14, 
},
templeCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ffffff", 
  borderRadius: 22,
  marginVertical: 10,
  marginHorizontal: 16,
  padding: 18,
  borderWidth: 3,
  borderColor: "#c0c0c0", 
  elevation: 45, 
  shadowColor: "#ffb84d", 
  shadowOpacity: 0.9,
  shadowOffset: { width: 0, height: 14 },
  shadowRadius: 40,
  shadowColor: "#ffd966", 
  shadowOpacity: 0.8,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 55,
  transform: [{ scale: 1.03 }, { translateY: -2 }],
},
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 45,
    backgroundColor: "#eee",
    marginHorizontal: 5,
  },
  textContainer: { flex: 1, justifyContent: "center" },
 placeName: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000",
  marginBottom: 4,
},
placeDescription: {
  fontSize: 13,
  color: "#555",
  lineHeight: 18,
  marginBottom: 8,
},
iconRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
},
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
    marginRight: 10,
  },
  toggleButtonText: {
    color: "#93210A",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 6,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
categoryPill: {
  width: 150,
  height: 90,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ffffff",
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 6,
  marginHorizontal: 8,
  marginVertical: 10,
  elevation: 26, 
  shadowColor: "#854607ff",
  shadowOpacity: 0.9,
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 24,
  borderWidth: 2,
  borderColor: "#b0b0b0", 
  transform: [{ scale: 1.03 }],
  marginLeft: 18,
},

  categoryIcon: { 
    width: 60, 
    height: 60, 
    borderRadius: 10, 
    marginRight: 10
   },
  categoryLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#333"
   },
  videoContainer: { 
    padding: 15, 
    backgroundColor: "#fff" 
  },
  sectionTitle1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    left: 110,
  },
  noVideoText: { 
    textAlign: "center", 
    color: "#555", 
    marginTop: 10
   },
});