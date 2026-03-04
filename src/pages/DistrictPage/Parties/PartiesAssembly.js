// Parties.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

// Professional color palette
const COLORS = {
  primary: "#ff3b63",      // Bright pink
  secondary: "#ff2f55",    // Darker pink
  lightPink: "#fff0f0",    // Very light pink
  text: "#212529",         // Dark gray
  textLight: "#6c757d",    // Medium gray
  white: "#ffffff",
  cardBg: "#ffffff",
  lightBg: "#f8f9fa",
  shadow: "#000000",
  border: "#e9ecef",
  headerBg: "#ff3b63",     // Pink header
  cardGradient1: "#ff6b6b",
  cardGradient2: "#ff8787",
};

// Party data
const PARTIES = [
  {
    id: "1",
    name: "தமிழ்நாடு சட்டமன்ற உறுப்பினர்கள்",
    englishName: "Tamil Nadu Assembly Members",
    image: require("../../assets/parties/assembly.jpg"),
    type: "assembly",
    count: 234,
  },
  {
    id: "2",
    name: "நாடாளுமன்ற உறுப்பினர்கள்",
    englishName: "Parliament Members",
    image: require("../../assets/parties/parliament.jpg"),
    type: "parliament",
    count: 39,
  },
  {
    id: "3",
    name: "திமுக கட்சி",
    englishName: "DMK Party",
    image: require("../../assets/parties/dmk.jpg"),
    type: "party",
    count: 133,
  },
  {
    id: "4",
    name: "அதிமுக கட்சி",
    englishName: "AIADMK Party",
    image: require("../../assets/parties/aiadmk.jpg"),
    type: "party",
    count: 66,
  },
  {
    id: "5",
    name: "பாஜக கட்சி",
    englishName: "BJP Party",
    image: require("../../assets/parties/bjp.jpg"),
    type: "party",
    count: 4,
  },
  {
    id: "6",
    name: "காங்கிரஸ் கட்சி",
    englishName: "Congress Party",
    image: require("../../assets/parties/congress.jpg"),
    type: "party",
    count: 18,
  },
  {
    id: "7",
    name: "மதிமுக கட்சி",
    englishName: "MDMK Party",
    image: require("../../assets/parties/mdmk.jpg"),
    type: "party",
    count: 6,
  },
  {
    id: "8",
    name: "விசிக கட்சி",
    englishName: "VCK Party",
    image: require("../../assets/parties/vck.jpg"),
    type: "party",
    count: 4,
  },
];

export default function Parties() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  // Determine device type
  const isTablet = width >= 768;
  const isMobile = width < 768;
  const isLandscape = width > height;

  // Responsive values
  const getResponsiveValues = () => {
    if (isTablet) {
      return {
        headerPadding: Platform.OS === 'ios' ? 60 : 50,
        headerTitleSize: 28,
        headerIconSize: 32,
        contentPadding: 24,
        gap: 20,
        columns: isLandscape ? 3 : 2,
        cardWidth: (width - (isLandscape ? 96 : 72)) / (isLandscape ? 3 : 2),
        cardHeight: 240,
        imageSize: 120,
        nameSize: 20,
        englishNameSize: 14,
        countSize: 16,
        borderRadius: 24,
        iconBtnSize: 50,
      };
    } else {
      return {
        headerPadding: Platform.OS === 'ios' ? 50 : 40,
        headerTitleSize: 20,
        headerIconSize: 24,
        contentPadding: 12,
        gap: 12,
        columns: 2,
        cardWidth: (width - 36) / 2,
        cardHeight: 200,
        imageSize: 90,
        nameSize: 16,
        englishNameSize: 12,
        countSize: 14,
        borderRadius: 16,
        iconBtnSize: 40,
      };
    }
  };

  const responsive = getResponsiveValues();

  const goBack = () => {
    navigation.goBack();
  };

  const handlePartyPress = (party) => {
    // Navigate to party details screen
    console.log("Party pressed:", party.name);
    // navigation.navigate('PartyDetails', { party });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerBg} />

      {/* Header with Back Arrow and Title */}
      <View style={[
        styles.header,
        {
          paddingTop: responsive.headerPadding,
          paddingHorizontal: responsive.contentPadding,
          backgroundColor: COLORS.headerBg,
        }
      ]}>
        <TouchableOpacity
          onPress={goBack}
          style={[styles.headerIconBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]}
        >
          <Ionicons
            name="arrow-back"
            size={responsive.headerIconSize}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: responsive.headerTitleSize }]}>
          Parties
        </Text>

        <View style={{ width: responsive.iconBtnSize }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { padding: responsive.contentPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { fontSize: isTablet ? 22 : 18 }]}>
            அரசியல் கட்சிகள் மற்றும் தலைவர்கள்
          </Text>
          <Text style={[styles.sectionSubtitle, { fontSize: isTablet ? 16 : 14 }]}>
            Political Parties and Leaders
          </Text>
        </View>

        {/* Party Cards Grid */}
        <View style={[styles.cardsGrid, { gap: responsive.gap }]}>
          {PARTIES.map((party) => (
            <TouchableOpacity
              key={party.id}
              activeOpacity={0.8}
              onPress={() => handlePartyPress(party)}
              style={{ width: responsive.cardWidth }}
            >
              <LinearGradient
                colors={[COLORS.cardGradient1, COLORS.cardGradient2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.partyCard,
                  {
                    height: responsive.cardHeight,
                    borderRadius: responsive.borderRadius,
                    padding: responsive.gap,
                  }
                ]}
              >
                {/* Party Image */}
                <View style={[styles.imageContainer, {
                  width: responsive.imageSize,
                  height: responsive.imageSize,
                  borderRadius: responsive.imageSize / 2,
                }]}>
                  <Image
                    source={party.image}
                    style={styles.partyImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Party Info */}
                <View style={styles.partyInfo}>
                  <Text style={[styles.partyName, { fontSize: responsive.nameSize }]}>
                    {party.name}
                  </Text>
                  <Text style={[styles.partyEnglishName, { fontSize: responsive.englishNameSize }]}>
                    {party.englishName}
                  </Text>
                  
                  {/* Count Badge */}
                  {party.count && (
                    <View style={[styles.countBadge, { 
                      paddingHorizontal: responsive.gap / 2,
                      paddingVertical: responsive.gap / 4,
                      borderRadius: responsive.borderRadius / 2,
                    }]}>
                      <Text style={[styles.countText, { fontSize: responsive.countSize }]}>
                        {party.count} உறுப்பினர்கள்
                      </Text>
                    </View>
                  )}
                </View>

                {/* Arrow Icon */}
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Assembly Leaders Section */}
        <View style={[styles.leadersSection, { 
          marginTop: responsive.gap * 2,
          padding: responsive.gap,
          borderRadius: responsive.borderRadius,
        }]}>
          <Text style={[styles.leadersTitle, { fontSize: isTablet ? 20 : 18 }]}>
            சட்டமன்ற தலைவர்கள்
          </Text>
          <Text style={[styles.leadersSubtitle, { fontSize: isTablet ? 16 : 14 }]}>
            Assembly Leaders
          </Text>

          <View style={[styles.leadersGrid, { gap: responsive.gap, marginTop: responsive.gap }]}>
            {/* Leader Cards */}
            {[1, 2, 3].map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                style={[styles.leaderCard, { 
                  padding: responsive.gap,
                  borderRadius: responsive.borderRadius,
                }]}
              >
                <View style={[styles.leaderImageContainer, {
                  width: isTablet ? 70 : 60,
                  height: isTablet ? 70 : 60,
                  borderRadius: isTablet ? 35 : 30,
                }]}>
                  <Image
                    source={require("../../assets/parties/leader-placeholder.jpg")}
                    style={styles.leaderImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.leaderInfo}>
                  <Text style={[styles.leaderName, { fontSize: isTablet ? 18 : 16 }]}>
                    தலைவர் பெயர்
                  </Text>
                  <Text style={[styles.leaderParty, { fontSize: isTablet ? 16 : 14 }]}>
                    கட்சி பெயர்
                  </Text>
                  <Text style={[styles.leaderPosition, { fontSize: isTablet ? 14 : 12 }]}>
                    சட்டமன்ற உறுப்பினர்
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { 
          marginTop: responsive.gap * 2,
          padding: responsive.gap,
          borderRadius: responsive.borderRadius,
        }]}>
          <Text style={[styles.footerText, { fontSize: isTablet ? 14 : 12 }]}>
            * தமிழ்நாடு சட்டமன்ற உறுப்பினர்கள் விவரங்கள்
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "900",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  // Section Title
  sectionTitleContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontWeight: "600",
    color: COLORS.textLight,
  },

  // Cards Grid
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Party Card
  partyCard: {
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    marginBottom: 0,
  },
  imageContainer: {
    backgroundColor: COLORS.white,
    padding: 4,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  partyImage: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  partyInfo: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  partyName: {
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 4,
  },
  partyEnglishName: {
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginTop: 4,
  },
  countText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  arrowContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },

  // Leaders Section
  leadersSection: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  leadersTitle: {
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
  },
  leadersSubtitle: {
    fontWeight: "600",
    color: COLORS.textLight,
  },
  leadersGrid: {
    width: "100%",
  },
  leaderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leaderImageContainer: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  leaderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 2,
  },
  leaderParty: {
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 2,
  },
  leaderPosition: {
    fontWeight: "600",
    color: COLORS.textLight,
  },

  // Footer
  footer: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  footerText: {
    color: COLORS.textLight,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
});