// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { fetchTourismByType } from "../../../Controller/TourismController/TourismController";

// export default function TourismPage2() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { typeId, typeName } = route.params;

//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadPlaces = async () => {
//       try {
//         const data = await fetchTourismByType(typeId);
//         setPlaces(data);
//       } catch (error) {
//         console.error("Error loading tourism places:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPlaces();
//   }, [typeId]);

//   if (loading)
//     return (
//       <View style={[styles.container, { justifyContent: "center" }]}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={26} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{typeName}</Text>
//       </View>

//       {/* List */}
//       <FlatList
//         data={places}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate("TourismPage3", { id: item.id })}
//           >
//             <Image
//               source={{
//                 uri:
//                   item.bannerImage ||
//                   "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
//               }}
//               style={styles.image}
//             />
//             <View style={styles.info}>
//               <Text style={styles.name}>{item.name}</Text>
//               <Text style={styles.title}>{item.title}</Text>
//               {item.phone && (
//                 <Text style={styles.phone}>📞 {item.phone}</Text>
//               )}
//             </View>
//           </TouchableOpacity>
//         )}
//         contentContainerStyle={{ padding: 15 }}
//       />
//     </SafeAreaView>
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
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     marginBottom: 15,
//     elevation: 3,
//     overflow: "hidden",
//   },
//   image: { width: "100%", height: 160 },
//   info: { padding: 10 },
//   name: { fontSize: 18, fontWeight: "bold", color: "#333" },
//   title: { fontSize: 14, color: "#666", marginVertical: 4 },
//   phone: { fontSize: 14, color: "#2E8B57", fontWeight: "bold" },
// });




import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchTourismByType } from "../../../Controller/TourismController/TourismController";

export default function TourismPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { typeId, typeName } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchTourismByType(typeId);
        setPlaces(data);
      } catch (error) {
        console.error("Error loading tourism places:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, [typeId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  const numColumns = isTablet ? 2 : 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 32 : 26}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          {typeName}
        </Text>
      </View>

      {/* 🔹 Grid List */}
      <FlatList
        data={places}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          isTablet && styles.listContentTablet,
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isTablet && styles.cardTablet,
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
                isTablet && styles.imageTablet,
              ]}
            />

            <View style={styles.info}>
              <Text
                style={[styles.name, isTablet && styles.nameTablet]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text
                style={[styles.title, isTablet && styles.titleTablet]}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              {item.phone && (
                <Text
                  style={[styles.phone, isTablet && styles.phoneTablet]}
                >
                  📞 {item.phone}
                </Text>
              )}
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
    backgroundColor: "#fff",
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  /* 🔹 Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
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


  /* 🔹 Grid */
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  listContentTablet: {
    paddingHorizontal: 28,
    paddingTop: 24,
  },

  /* 🔹 Card */
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 6,
    elevation: 3,
    overflow: "hidden",
  },
  cardTablet: {
    borderRadius: 16,
    marginBottom: 24,
  },

  /* 🔹 Image */
  image: {
    width: "100%",
    height: 160,
  },
  imageTablet: {
    height: 240,
  },

  /* 🔹 Info */
  info: {
    padding: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  nameTablet: {
    fontSize: 22,
  },

  title: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  titleTablet: {
    fontSize: 16,
    marginVertical: 6,
  },

  phone: {
    fontSize: 14,
    color: "#2E8B57",
    fontWeight: "bold",
    marginTop: 4,
  },
  phoneTablet: {
    fontSize: 16,
    marginTop: 6,
  },
});
