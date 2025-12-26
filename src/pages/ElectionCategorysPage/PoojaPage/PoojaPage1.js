// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { fetchAllPoojas } from "../../../Controller/PoojaController/PoojaController";

// export default function PoojaPage1({ navigation }) {
//   const [poojas, setPoojas] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadPoojas = async () => {
//       try {
//         const data = await fetchAllPoojas();
//         setPoojas(data);
//       } catch (error) {
//         console.error("Error loading poojas:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPoojas();
//   }, []);

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={30} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Pooja</Text>
//       </View>

//       {/* Pooja List */}
//       <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
//         {poojas.map((item) => (
//           <TouchableOpacity
//             key={item.id}
//             style={styles.card}
//             onPress={() => navigation.navigate("PoojaPage2", { id: item.id })}
//           >
//             <Image source={{ uri: item.bannerimg }} style={styles.image} resizeMode="cover" />
//             <View style={styles.bottomRow}>
//               <Text style={styles.title}>{item.title}</Text>
//               <Ionicons name="play" size={20} color="maroon" />
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginTop: 31,
//     backgroundColor: "#93210A",
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginLeft: 16,
//   },
//   container: {
//     padding: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     marginBottom: 20,
//     borderRadius: 20,
//     overflow: "hidden",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   image: {
//     width: "100%",
//     height: 150,
//   },
//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#000",
//   },
// });







import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllPoojas } from "../../../Controller/PoojaController/PoojaController";

export default function PoojaPage1({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoojas = async () => {
      try {
        const data = await fetchAllPoojas();
        setPoojas(data);
      } catch (error) {
        console.error("Error loading poojas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPoojas();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  const numColumns = isTablet ? 2 : 1;

  return (
    <View style={styles.screen}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 34 : 30}
            color="#fff"
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
        >
          Pooja
        </Text>
      </View>

      {/* 🔹 Pooja Grid */}
      <FlatList
        data={poojas}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          isTablet && styles.containerTablet,
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isTablet && styles.cardTablet,
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("PoojaPage2", { id: item.id })
            }
          >
            <Image
              source={{ uri: item.bannerimg }}
              style={[styles.image, isTablet && styles.imageTablet]}
              resizeMode="cover"
            />

            <View
              style={[
                styles.bottomRow,
                isTablet && styles.bottomRowTablet,
              ]}
            >
              <Text
                style={[styles.title, isTablet && styles.titleTablet]}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <Ionicons
                name="play"
                size={isTablet ? 26 : 20}
                color="maroon"
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  /* 🔹 Screen */
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* 🔹 Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 31,
    backgroundColor: "#93210A",
  },
  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 24,
    marginTop: -3,
  },
   headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22, marginLeft: 65,
    padding:8,
   

  },

  headerTitleTablet: {
    fontSize: 28,
    padding:8,
    left:125,
  },


  /* 🔹 Grid Container */
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  containerTablet: {
    paddingHorizontal: 28,
    paddingTop: 24,
  },

  /* 🔹 Card */
  card: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginHorizontal: 6, // spacing between columns
  },
  cardTablet: {
    marginBottom: 28,
    borderRadius: 24,
  },

  /* 🔹 Image */
  image: {
    width: "100%",
    height: 150,
  },
  imageTablet: {
    height: 220,
  },

  /* 🔹 Bottom Row */
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bottomRowTablet: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  /* 🔹 Title */
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 10,
  },
  titleTablet: {
    fontSize: 20,
  },
});
