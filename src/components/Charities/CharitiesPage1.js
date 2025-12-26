// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { getCharities } from "../../Controller/CharityController/CharityController";

// export default function CharityPage1() {
//   const navigation = useNavigation();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadCharities = async () => {
//       try {
//         const result = await getCharities();
//         setData(result);
//       } catch (err) {
//         console.error("❌ Error loading charities:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadCharities();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name="chevron-back"
//           size={26}
//           color="#fff"
//           onPress={() => navigation.goBack()}
//         />
//         <Text style={styles.headerText}>Charities</Text>
//       </View>

//       {/* List */}
//       <ScrollView style={styles.scrollContainer}>
//         {data.length === 0 ? (
//           <Text style={styles.noData}>No charities available.</Text>
//         ) : (
//           data.map((item, index) => (
//             <View key={index} style={styles.card}>
//               <View style={styles.textContainer}>
//                 <Text style={styles.title}>{item.name}</Text>
//                 <Text style={styles.heading}>"{item.heading}"</Text>

//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={() =>
//                     navigation.navigate("CharitiesPage2", { charity: item })
//                   }
//                 >
//                   <Text style={styles.buttonText}>View More</Text>
//                 </TouchableOpacity>
//               </View>

//               {item.bannerImage ? (
//                 <Image source={{ uri: item.bannerImage }} style={styles.image} />
//               ) : null}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginTop: 32,
//     backgroundColor: "#93210A",
//   },
//   headerText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 20,
//     marginLeft: 10,
//   },
//   scrollContainer: { padding: 15 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   card: {
//     flexDirection: "row",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   textContainer: { flex: 1, paddingRight: 10 },
//   title: { fontSize: 16, fontWeight: "bold", color: "#000" },
//   heading: { fontSize: 13, color: "#555", marginBottom: 10 },
//   button: {
//     backgroundColor: "#971A01",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 8,
//     alignSelf: "flex-start",
//   },
//   buttonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
//   image: { width: 70, height: 70, borderRadius: 35 },
//   noData: { textAlign: "center", marginTop: 50, color: "#777", fontSize: 16 },
// });











import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getCharities } from "../../Controller/CharityController/CharityController";

/* ===================== RESPONSIVE HELPER ===================== */
const useResponsive = () => {
  const { width } = useWindowDimensions();
  return {
    isMobile: width < 768,
    isTablet: width >= 600 && width < 1024,
    isLargeTablet: width >= 1024,
  };
};

export default function CharityPage1() {
  const navigation = useNavigation();
  const { isMobile, isTablet, isLargeTablet } = useResponsive();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    const loadCharities = async () => {
      try {
        const result = await getCharities();
        setData(result);
      } catch (err) {
        console.error("❌ Error loading charities:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCharities();
  }, []);

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ===================== HEADER ===================== */}
      <View
        style={[
          styles.header,
          isTablet && styles.headerTablet,
          isLargeTablet && styles.headerLargeTablet,
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isMobile ? 26 : 32}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerText,
            isTablet && styles.headerTextTablet,
          ]}
        >
          Charities
        </Text>
      </View>

      {/* ===================== LIST ===================== */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isTablet && styles.scrollContainerTablet,
          isLargeTablet && styles.scrollContainerLargeTablet,
        ]}
      >
        {data.length === 0 ? (
          <Text style={styles.noData}>No charities available.</Text>
        ) : (
          data.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={[
                styles.card,
                isTablet && styles.cardTablet,
                isLargeTablet && styles.cardLargeTablet,
              ]}
              onPress={() =>
                navigation.navigate("CharitiesPage2", { charity: item })
              }
            >
              {/* TEXT */}
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.title,
                    isTablet && styles.titleTablet,
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.heading,
                    isTablet && styles.headingTablet,
                  ]}
                  numberOfLines={2}
                >
                  “{item.heading}”
                </Text>

                <View style={styles.button}>
                  <Text style={styles.buttonText}>View More</Text>
                </View>
              </View>

              {/* IMAGE */}
              {item.bannerImage ? (
                <Image
                  source={{ uri: item.bannerImage }}
                  style={[
                    styles.image,
                    isTablet && styles.imageTablet,
                    isLargeTablet && styles.imageLargeTablet,
                  ]}
                />
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* CENTER */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
  header: {
   flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerTablet: {
    paddingHorizontal: 30,
    paddingTop: 55,
    paddingVertical:35,
    marginTop:-3,
  },
  headerLargeTablet: {
    paddingHorizontal: 60,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 12,
  },
  headerTextTablet: {
    fontSize: 26,
  },

  /* SCROLL */
  scrollContainer: {
    padding: 15,
  },
  scrollContainerTablet: {
    paddingHorizontal: 30,
  },
  scrollContainerLargeTablet: {
    paddingHorizontal: 80,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 4,
  },
  cardTablet: {
    padding: 29,
    marginBottom: 20,
  },
  cardLargeTablet: {
    padding: 24,
  },

  /* TEXT */
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  titleTablet: {
    fontSize: 19,
  },
  heading: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
  },
  headingTablet: {
    fontSize: 16,
  },

  /* BUTTON */
  button: {
    backgroundColor: "#971A01",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  /* IMAGE */
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  imageTablet: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  imageLargeTablet: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  /* NO DATA */
  noData: {
    textAlign: "center",
    marginTop: 60,
    color: "#777",
    fontSize: 16,
  },
});
