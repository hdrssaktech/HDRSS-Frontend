
// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";

// export default function Sidebar({ closeSidebar }) {
//   const items = [
//     { label: "Home", icon: "home", screen: "HomePage" },
//     { label: "About", icon: "info", screen: "AboutPage1" },
//     { label: "Charities", icon: "volunteer-activism", screen: "CharitiePage1" },
//   ];

//   const navigation = useNavigation();

//   const handlePress = (screen) => {
//     navigation.navigate(screen);
//     if (closeSidebar) closeSidebar(); // closes sidebar after click
//   };

//   return (
//     <View style={styles.overlay}>
//       {/* Transparent background that closes sidebar when tapped */}
//       <TouchableWithoutFeedback onPress={closeSidebar}>
//         <View style={styles.background} />
//       </TouchableWithoutFeedback>

//       {/* Sidebar content */}
//       <View style={styles.sidebar}>
//         {items.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.menuItem}
//             onPress={() => handlePress(item.screen)}
//           >
//             <Icon
//               name={item.icon}
//               size={24}
//               color="#E65100"
//               style={styles.icon}
//             />
//             <Text style={styles.label}>{item.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     flexDirection: "row",
//   },
//   background: {
//     flex: 1, // fills remaining space, acts as outside touch area
//     backgroundColor: "rgba(0,0,0,0.3)", // dim background
//   },
//   sidebar: {
//     width: 250,
//     backgroundColor: "#fff",
//     paddingTop: 60,
//     elevation: 8,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#ddd",
//   },
//   icon: {
//     marginRight: 20,
//   },
//   label: {
//     fontSize: 16,
//     color: "#333",
//   },
// });




import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 600;

export default function Sidebar({ closeSidebar }) {
  const items = [
    { label: "Home", icon: "home", screen: "HomePage" },
    { label: "About", icon: "info", screen: "AboutPage1" },
    { label: "Charities", icon: "volunteer-activism", screen: "CharitiePage1" },
  ];

  const navigation = useNavigation();

  const handlePress = (screen) => {
    navigation.navigate(screen);
    if (closeSidebar) closeSidebar(); // closes sidebar after click
  };

  return (
    <View style={styles.overlay}>
      {/* Transparent background that closes sidebar when tapped */}
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      {/* Sidebar content */}
      <View style={styles.sidebar}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handlePress(item.screen)}
          >
            <Icon
              name={item.icon}
              size={isTablet ? 28 : 24}
              color="#E65100"
              style={styles.icon}
            />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  background: {
    flex: 1, // fills remaining space, acts as outside touch area
    backgroundColor: "rgba(0,0,0,0.3)", // dim background
    // Tablet adjustments
    ...(isTablet && {
      backgroundColor: "rgba(0,0,0,0.4)",
    })
  },
  sidebar: {
    width: 250,
    backgroundColor: "#fff",
    paddingTop: 60,
    elevation: 8,
    // Tablet adjustments
    ...(isTablet && {
      width: 250,
      paddingTop: 70,
 
    })
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    // Tablet adjustments
    ...(isTablet && {
      paddingVertical: 18,
      paddingHorizontal: 22,
    })
  },
  icon: {
    marginRight: 20,
    // Tablet adjustments
    ...(isTablet && {
      marginRight: 22,
    })
  },
  label: {
    fontSize: 16,
    color: "#333",
    // Tablet adjustments
    ...(isTablet && {
      fontSize: 18,
    })
  },
});