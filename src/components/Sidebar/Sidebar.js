// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   useWindowDimensions,
//   Linking,
//   Image,
//   ScrollView,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";

// const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@hdrsssandilyan";

// export default function Sidebar({ closeSidebar }) {
//   const { width: screenWidth } = useWindowDimensions();
//   const isTablet = screenWidth >= 600;

//   const sidebarWidth = isTablet
//     ? Math.min(380, screenWidth * 0.45)
//     : Math.min(300, screenWidth * 0.82);

//   const items = [
//     { label: "Home",              icon: "home",             screen: "HomePage"    },
//     { label: "About",             icon: "info",             screen: "AboutPage1"  },
//     { label: "Principles",        icon: "scale",            screen: "Principles"  },
//     { label: "Quiz",              icon: "help",             screen: "QuizCategories" },
//     { label: "Charities",         icon: "volunteer-activism",screen: "CharitiePage1"},
//     { label: "HDRSS Leader",      icon: "person",           screen: "Member"      },
//     { label: "Membership Form",   icon: "assignment",       screen: "Member1"     },
//     { label: "2026 Election Survey", icon: "how-to-vote",   screen: "Assemblies"  },
//     { label: "Job Opportunities", icon: "work",             screen: "JobPage1"    },
//     { label: "Events History",    icon: "history",          screen: "EventMonth"  },
//     { label: "News History",      icon: "article",          screen: "NewsMonth"  },
//   ];

//   const navigation = useNavigation();

//   const handlePress = (screen) => {
//     navigation.navigate(screen);
//     if (closeSidebar) closeSidebar();
//   };

//   const handleYouTube = () => {
//     Linking.openURL(YOUTUBE_CHANNEL_URL);
//     if (closeSidebar) closeSidebar();
//   };

//   return (
//     <View style={styles.overlay}>
//       {/* SIDEBAR */}
//       <View style={[styles.sidebar, { width: sidebarWidth }]}>
//         {/* ── Header ── */}
//         <View style={[styles.header, { paddingTop: isTablet ? 60 : 46 }]}>
//           <View style={styles.headerLeft}>
//             <View style={[styles.logoCircle, isTablet && styles.logoCircleTablet]}>
//               <Icon name="groups" size={isTablet ? 28 : 20} color="#fff" />
//             </View>
//             <View>
//               <Text style={[styles.orgName, isTablet && styles.orgNameTablet]}>
//                 HDRSS
//               </Text>
//               <Text style={[styles.orgSub, isTablet && styles.orgSubTablet]}>
//                 Rama Sandilyan
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity
//             onPress={closeSidebar}
//             hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//             style={[styles.closeBtn, isTablet && styles.closeBtnTablet]}
//           >
//             <Icon name="close" size={isTablet ? 24 : 18} color="#999" />
//           </TouchableOpacity>
//         </View>

//         {/* ── Menu Items — now scrollable so every item is reachable ── */}
//         <ScrollView
//           style={{ flex: 1 }}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={[
//             styles.menuScrollContent,
//             isTablet && styles.menuScrollContentTablet
//           ]}
//         >
//           {items.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.menuItem, isTablet && styles.menuItemTablet]}
//               activeOpacity={0.6}
//               onPress={() => handlePress(item.screen)}
//             >
//               <View style={[styles.iconWrap, isTablet && styles.iconWrapTablet]}>
//                 <Icon name={item.icon} size={isTablet ? 24 : 18} color="#E65100" />
//               </View>
//               <Text style={[styles.label, isTablet && styles.labelTablet]}>
//                 {item.label}
//               </Text>
//               <Icon 
//                 name="chevron-right" 
//                 size={isTablet ? 22 : 16} 
//                 color="#ddd" 
//                 style={{ marginLeft: "auto" }} 
//               />
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* ── YouTube Button ── */}
//         <View style={[styles.youtubeContainer, isTablet && styles.youtubeContainerTablet]}>
//           <TouchableOpacity
//             style={[styles.youtubeButton, isTablet && styles.youtubeButtonTablet]}
//             onPress={handleYouTube}
//             activeOpacity={0.85}
//           >
//             <View style={[styles.ytIconWrap, isTablet && styles.ytIconWrapTablet]}>
//               <Icon name="play-arrow" size={isTablet ? 22 : 16} color="#CC0000" />
//             </View>
//             <Text style={[styles.youtubeText, isTablet && styles.youtubeTextTablet]}>
//               Watch on YouTube
//             </Text>
//             <Icon name="open-in-new" size={isTablet ? 18 : 14} color="rgba(255,255,255,0.6)" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* DIM BACKGROUND */}
//       <TouchableWithoutFeedback onPress={closeSidebar}>
//         <View style={styles.background} />
//       </TouchableWithoutFeedback>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     flexDirection: "row",
//   },
//   background: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//   },

//   /* Sidebar shell */
//   sidebar: {
//     flex: 1,
//     backgroundColor: "#FAFAFA",
//     elevation: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 3, height: 0 },
//     shadowOpacity: 0.18,
//     shadowRadius: 12,
//   },

//   /* Header */
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingBottom: 14,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   logoCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#E65100",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logoCircleTablet: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   orgName: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#1A1A1A",
//     letterSpacing: 0.5,
//   },
//   orgNameTablet: {
//     fontSize: 20,
//     letterSpacing: 0.8,
//   },
//   orgSub: {
//     fontSize: 11,
//     color: "#999",
//     fontWeight: "500",
//     marginTop: -1,
//   },
//   orgSubTablet: {
//     fontSize: 15,
//     marginTop: -2,
//   },
//   closeBtn: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#F5F5F5",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   closeBtnTablet: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },

//   /* Menu scroll content */
//   menuScrollContent: {
//     paddingBottom: 12,
//   },
//   menuScrollContentTablet: {
//     paddingBottom: 20,
//     paddingTop: 10,
//   },

//   /* Menu item */
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 1,
//     marginHorizontal: 8,
//     marginVertical: 1,
//     borderRadius: 10,
//   },
//   menuItemTablet: {
//     paddingVertical: 14,
//     marginHorizontal: 120,
//     marginVertical: 2,
//     borderRadius: 12,
//   },
//   iconWrap: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     backgroundColor: "#FFF3EE",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   iconWrapTablet: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     marginRight: 16,
//   },
//   label: {
//     fontSize: 14,
//     color: "#2D2D2D",
//     fontWeight: "500",
//   },
//   labelTablet: {
//     fontSize: 18,
//     fontWeight: "600",
//   },

//   /* YouTube button */
//   youtubeContainer: {
//     paddingHorizontal: 14,
//     paddingBottom: 28,
//     paddingTop: 10,
//   },
//   youtubeContainerTablet: {
//     paddingHorizontal: 18,
//     paddingBottom: 35,
//     paddingTop: 15,
//   },
//   youtubeButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#CC0000",
//     borderRadius: 10,
//     paddingVertical: 11,
//     paddingHorizontal: 14,
//     elevation: 4,
//     shadowColor: "#CC0000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     gap: 10,
//   },
//   youtubeButtonTablet: {
//     borderRadius: 14,
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     gap: 14,
//     elevation: 6,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 12,
//   },
//   ytIconWrap: {
//     width: 26,
//     height: 26,
//     borderRadius: 6,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ytIconWrapTablet: {
//     width: 36,
//     height: 36,
//     borderRadius: 8,
//   },
//   youtubeText: {
//     flex: 1,
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#fff",
//     letterSpacing: 0.3,
//   },
//   youtubeTextTablet: {
//     fontSize: 18,
//     letterSpacing: 0.5,
//   },
// });


import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@hdrsssandilyan";

export default function Sidebar({ closeSidebar }) {
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 600;

  const sidebarWidth = isTablet
    ? Math.min(380, screenWidth * 0.45)
    : Math.min(300, screenWidth * 0.82);

  const items = [
    { label: "Home",              icon: "home",             screen: "HomePage"    },
    { label: "About",             icon: "info",             screen: "AboutPage1"  },
    { label: "Principles",        icon: "scale",            screen: "Principles"  },
    { label: "Quiz",              icon: "help",             screen: "QuizCategories" },
    { label: "Charities",         icon: "volunteer-activism",screen: "CharitiePage1"},
    { label: "HDRSS Leader",      icon: "person",           screen: "Member"      },
    { label: "Membership Form",   icon: "assignment",       screen: "Member1"     },
    { label: "2026 Election Survey", icon: "how-to-vote",   screen: "Assemblies"  },
    { label: "Job Opportunities", icon: "work",             screen: "JobPage1"    },
    { label: "Events History",    icon: "history",          screen: "EventMonth"  },
    { label: "News History",      icon: "article",          screen: "NewsMonth"  },
  ];

  const navigation = useNavigation();

  const handlePress = (screen) => {
    navigation.navigate(screen);
    if (closeSidebar) closeSidebar();
  };

  const handleYouTube = () => {
    Linking.openURL(YOUTUBE_CHANNEL_URL);
    if (closeSidebar) closeSidebar();
  };

  return (
    // 🔹 On tablet the sidebar sits on the RIGHT: we just reverse the row
    // direction so the dim background renders first (left side) and the
    // sidebar panel renders last (right side). Mobile keeps the original
    // left-side layout untouched.
    <View style={[styles.overlay, isTablet && styles.overlayTablet]}>
      {/* SIDEBAR */}
      <View
        style={[
          styles.sidebar,
          isTablet ? styles.sidebarTablet : styles.sidebarMobile,
          { width: sidebarWidth },
        ]}
      >
        {/* ── Header ── */}
        <View
          style={[
            styles.header,
            isTablet && styles.headerTablet,
            { paddingTop: isTablet ? 60 : 46 },
          ]}
        >
          <View style={[styles.headerLeft, isTablet && styles.headerLeftTablet]}>
            <View style={[styles.logoCircle, isTablet && styles.logoCircleTablet]}>
              <Icon name="groups" size={isTablet ? 28 : 20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.orgName, isTablet && styles.orgNameTablet]}>
                HDRSS
              </Text>
              <Text style={[styles.orgSub, isTablet && styles.orgSubTablet]}>
                Rama Sandilyan
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={closeSidebar}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[styles.closeBtn, isTablet && styles.closeBtnTablet]}
          >
            <Icon name="close" size={isTablet ? 24 : 18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* ── Menu Items — now scrollable so every item is reachable ── */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.menuScrollContent,
            isTablet && styles.menuScrollContentTablet
          ]}
        >
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isTablet && styles.menuItemTablet]}
              activeOpacity={0.6}
              onPress={() => handlePress(item.screen)}
            >
              <View style={[styles.iconWrap, isTablet && styles.iconWrapTablet]}>
                <Icon name={item.icon} size={isTablet ? 24 : 18} color="#E65100" />
              </View>
              <Text style={[styles.label, isTablet && styles.labelTablet]}>
                {item.label}
              </Text>
              <Icon 
                name="chevron-right" 
                size={isTablet ? 22 : 16} 
                color="#ddd" 
                style={{ marginLeft: "auto" }} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── YouTube Button ── */}
        <View style={[styles.youtubeContainer, isTablet && styles.youtubeContainerTablet]}>
          <TouchableOpacity
            style={[styles.youtubeButton, isTablet && styles.youtubeButtonTablet]}
            onPress={handleYouTube}
            activeOpacity={0.85}
          >
            <View style={[styles.ytIconWrap, isTablet && styles.ytIconWrapTablet]}>
              <Icon name="play-arrow" size={isTablet ? 22 : 16} color="#CC0000" />
            </View>
            <Text style={[styles.youtubeText, isTablet && styles.youtubeTextTablet]}>
              Watch on YouTube
            </Text>
            <Icon name="open-in-new" size={isTablet ? 18 : 14} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* DIM BACKGROUND */}
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  overlayTablet: {
    // 🔹 reversing the row puts the sidebar (first JSX child) on the right
    // and the dim background (second JSX child) on the left
    flexDirection: "row-reverse",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  /* Sidebar shell */
  sidebar: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  sidebarMobile: {
    // shadow falls to the right, toward the dimmed content behind it
    shadowOffset: { width: 3, height: 0 },
  },
  sidebarTablet: {
    // 🔹 panel is now on the right, so the shadow must fall to the LEFT
    // (toward the dimmed content), not off the right edge of the screen
    elevation: 20,
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTablet: {
    paddingHorizontal: 26,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftTablet: {
    gap: 16,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E65100",
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircleTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  orgName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
  orgNameTablet: {
    fontSize: 20,
    letterSpacing: 0.8,
  },
  orgSub: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
    marginTop: -1,
  },
  orgSubTablet: {
    fontSize: 15,
    marginTop: -2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnTablet: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  /* Menu scroll content */
  menuScrollContent: {
    paddingBottom: 12,
  },
  menuScrollContentTablet: {
    paddingBottom: 20,
    paddingTop: 10,
  },

  /* Menu item */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 1,
    marginHorizontal: 8,
    marginVertical: 1,
    borderRadius: 10,
  },
  menuItemTablet: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginHorizontal: 12,
    marginVertical: 2,
    borderRadius: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFF3EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconWrapTablet: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 16,
  },
  label: {
    fontSize: 14,
    color: "#2D2D2D",
    fontWeight: "500",
  },
  labelTablet: {
    fontSize: 18,
    fontWeight: "600",
  },

  /* YouTube button */
  youtubeContainer: {
    paddingHorizontal: 14,
    paddingBottom: 28,
    paddingTop: 10,
  },
  youtubeContainerTablet: {
    paddingHorizontal: 18,
    paddingBottom: 35,
    paddingTop: 15,
  },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CC0000",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    elevation: 4,
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 10,
  },
  youtubeButtonTablet: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  ytIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ytIconWrapTablet: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  youtubeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  youtubeTextTablet: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
});