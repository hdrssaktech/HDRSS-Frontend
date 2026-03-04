import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from "react-native-youtube-iframe";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >=600;
const isLargeTablet = screenWidth >= 800;

// Responsive size helper
const responsiveSize = (mobile, tablet, largeTablet) => {
  if (isLargeTablet) return largeTablet || tablet;
  return isTablet ? tablet : mobile;
};

export default function TownBusinessPage4() {
  const route = useRoute();
  const navigation = useNavigation();
  const { businessData } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [expanded, setExpanded] = useState(false);
  
  const open = (url) => url && Linking.openURL(url);

  const extractYouTubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
    );
    return match ? match[1] : null;
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" />

      {/* HEADER */}
      <View style={[
        styles.header,
        { 
          paddingTop: Platform.OS === "ios" ? responsiveSize(55, 65, 70) : responsiveSize(45, 55, 60),
          paddingHorizontal: responsiveSize(16, 25, 30)
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { 
              padding: responsiveSize(6, 8, 10),
              borderRadius: responsiveSize(20, 24, 28)
            }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="chevron-back" 
            size={responsiveSize(28, 32, 36)} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <Text style={[
          styles.headerTitle,
          { fontSize: responsiveSize(18, 22, 24) }
        ]}>
          Business Details
        </Text>
        
        <View style={{ width: responsiveSize(40, 50, 60) }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO SECTION */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setSelectedImage(businessData.image);
            setModalVisible(true);
          }}
          style={styles.heroContainer}
        >
          <Image 
            source={{ uri: businessData.image }} 
            style={[
              styles.heroImage,
              { height: responsiveSize(260, 320, 380) }
            ]} 
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          />
          <View style={[
            styles.heroText,
            { bottom: responsiveSize(20, 25, 30) }
          ]}>
            <Text style={[
              styles.businessTitle,
              { fontSize: responsiveSize(22, 28, 32) }
            ]}>
              {businessData.title}
            </Text>
            <View style={[
              styles.rating,
              { marginTop: responsiveSize(6, 8, 10) }
            ]}>
              <Ionicons 
                name="star" 
                size={responsiveSize(16, 20, 22)} 
                color="#FFD700" 
              />
              <Text style={[
                styles.ratingText,
                { 
                  fontSize: responsiveSize(14, 16, 18),
                  marginLeft: responsiveSize(6, 8, 10)
                }
              ]}>
                4.8 • Business
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ABOUT SECTION */}
        <View style={[
          styles.card,
          { 
            margin: responsiveSize(16, 20, 24),
            padding: responsiveSize(16, 20, 24),
            borderRadius: responsiveSize(18, 22, 26)
          }
        ]}>
          <Text style={[
            styles.cardTitle,
            { fontSize: responsiveSize(18, 22, 24) }
          ]}>
            About
          </Text>
          <Text style={[
            styles.desc,
            { 
              fontSize: responsiveSize(15, 17, 19),
              lineHeight: responsiveSize(22, 26, 30)
            }
          ]}>
            {businessData.description || "No description available"}
          </Text>
          
          {businessData.description?.length > 120 && (
            <TouchableOpacity 
              onPress={() => setExpanded(!expanded)}
              style={styles.readMoreContainer}
            >
              <Text style={[
                styles.readMore,
                { fontSize: responsiveSize(14, 16, 18) }
              ]}>
                {expanded ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ACTION BUTTONS */}
        <View style={[
          styles.actions,
          { 
            marginHorizontal: responsiveSize(16, 20, 24),
            marginBottom: responsiveSize(8, 12, 16)
          }
        ]}>
          {businessData.phone && (
            <Action
              icon="call"
              label="Call"
              color="#93210A"
              onPress={() => open(`tel:${businessData.phone}`)}
            />
          )}

          {businessData.whatsapp && (
            <Action
              icon="logo-whatsapp"
              label="WhatsApp"
              color="#25D366"
              onPress={() =>
                open(
                  `https://wa.me/${businessData.whatsapp.replace(/\D/g, "")}`
                )
              }
            />
          )}

          {businessData.location && (
            <Action
              icon="location"
              label="Map"
              color="#FF6B35"
              onPress={() =>
                open(
                  `https://maps.google.com/?q=${encodeURIComponent(
                    businessData.location
                  )}`
                )
              }
            />
          )}
          
          {businessData.email && (
            <Action
              icon="mail"
              label="Email"
              color="#4285F4"
              onPress={() => open(`mailto:${businessData.email}`)}
            />
          )}
        </View>

        {/* GALLERY SECTION */}
        {businessData.gallery?.length > 0 && (
          <View style={[
            styles.card,
            { 
              margin: responsiveSize(16, 20, 24),
              padding: responsiveSize(16, 20, 24),
              borderRadius: responsiveSize(18, 22, 26)
            }
          ]}>
            <Text style={[
              styles.cardTitle,
              { fontSize: responsiveSize(18, 22, 24) }
            ]}>
              Photos
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingVertical: responsiveSize(10, 12, 14)
              }}
            >
              {businessData.gallery.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setSelectedImage(img);
                    setModalVisible(true);
                  }}
                  style={{ marginRight: responsiveSize(12, 16, 20) }}
                >
                  <Image
                    source={{ uri: img }}
                    style={[
                      styles.galleryImg,
                      { 
                        width: responsiveSize(140, 180, 200),
                        height: responsiveSize(140, 180, 200),
                        borderRadius: responsiveSize(14, 16, 18)
                      }
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* VIDEOS SECTION */}
        {businessData.videos?.length > 0 && (
          <View style={[
            styles.card,
            { 
              margin: responsiveSize(16, 20, 24),
              padding: responsiveSize(16, 20, 24),
              borderRadius: responsiveSize(18, 22, 26)
            }
          ]}>
            <Text style={[
              styles.cardTitle,
              { fontSize: responsiveSize(18, 22, 24) }
            ]}>
              Videos
            </Text>

            {businessData.videos.map((v, i) => {
              const videoId = extractYouTubeId(v);
              if (!videoId) return null;

              return (
                <View 
                  key={i} 
                  style={{ 
                    marginTop: i === 0 ? 0 : responsiveSize(16, 20, 24)
                  }}
                >
                  <YoutubePlayer
                    height={isTablet ? 350 : 230}
                    play={false}
                    videoId={videoId}
                  />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* IMAGE MODAL */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modal}>
          <TouchableOpacity
            style={[
              styles.close,
              { 
                top: Platform.OS === "ios" ? responsiveSize(60, 70, 80) : responsiveSize(50, 60, 70),
                right: responsiveSize(20, 25, 30)
              }
            ]}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons 
              name="close" 
              size={responsiveSize(30, 36, 40)} 
              color="#fff" 
            />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={[
              styles.modalImg,
              { 
                width: screenWidth * 0.9,
                height: screenWidth * 0.9
              }
            ]}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}

/* ACTION BUTTON COMPONENT */
const Action = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[
      styles.actionIcon, 
      { 
        backgroundColor: color,
        width: responsiveSize(46, 56, 66),
        height: responsiveSize(46, 56, 66),
        borderRadius: responsiveSize(23, 28, 33)
      }
    ]}>
      <Ionicons 
        name={icon} 
        size={responsiveSize(22, 26, 30)} 
        color="#fff" 
      />
    </View>
    <Text style={[
      styles.actionText,
      { fontSize: responsiveSize(12, 14, 16) }
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f4f4f4" 
  },

  scrollContent: {
    paddingBottom: responsiveSize(30, 40, 50),
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: responsiveSize(14, 18, 22),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: { 
    color: "#fff", 
    fontWeight: "700",
    textAlign: 'center',
    flex: 1,
  },

  heroContainer: {
    position: 'relative',
  },

  heroImage: {
    width: "100%",
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  heroText: {
    position: "absolute",
    left: responsiveSize(16, 25, 30),
  },

  businessTitle: {
    fontWeight: "800",
    color: "#fff",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  rating: { 
    flexDirection: "row", 
    alignItems: "center", 
  },

  ratingText: { 
    color: "#fff",
    fontWeight: '600',
  },

  card: {
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardTitle: { 
    fontWeight: "700", 
    marginBottom: responsiveSize(10, 12, 14),
    color: '#333',
  },

  desc: { 
    color: "#555", 
  },

  readMoreContainer: {
    alignSelf: 'flex-start',
    textAlign: 'right',
    marginTop: responsiveSize(6, 8, 10),
  },

  readMore: {
    color: "#93210A",
    fontWeight: "700",
    
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: isTablet ? 'wrap' : 'nowrap',
  },

  actionBtn: { 
    alignItems: "center",
    width: isTablet ? '25%' : '33%',
    marginBottom: responsiveSize(8, 12, 16),
  },

  actionIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveSize(6, 8, 10),
  },

  actionText: { 
    fontWeight: "600",
    color: '#333',
    textAlign: 'center',
  },

  // Contact Info Styles
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveSize(12, 16, 20),
    paddingVertical: responsiveSize(4, 6, 8),
  },

  contactIcon: {
    marginRight: responsiveSize(10, 12, 14),
    width: responsiveSize(24, 28, 32),
    textAlign: 'center',
  },

  contactText: {
    color: "#333",
    flex: 1,
    flexWrap: 'wrap',
  },

  galleryImg: {
    backgroundColor: '#f0f0f0',
  },

  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  close: { 
    position: "absolute",
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },

  modalImg: {
    backgroundColor: '#000',
  },
});