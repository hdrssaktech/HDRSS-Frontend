// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { fetchTourismTypes } from "../../../Controller/TourismController/TourismController";

// export default function TourismPage1() {
//   const navigation = useNavigation();
//   const [types, setTypes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadTypes = async () => {
//       try {
//         const data = await fetchTourismTypes();
//         setTypes(data);
//       } catch (error) {
//         console.error("Error loading types:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadTypes();
//   }, []);

//   if (loading)
//     return (
//       <View style={[styles.container, { justifyContent: "center" }]}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fff" }}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={28} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Tourist Places</Text>
//       </View>

//       {/* Body */}
//       <ScrollView style={{ padding: 15 }}>
//         {types.map((item) => (
//           <TouchableOpacity
//             key={item.id}
//             style={styles.card}
//             onPress={() =>
//               navigation.navigate("TourismPage2", {
//                 typeId: item.id,
//                 typeName: item.name,
//               })
//             }
//           >
//             <Image
//               source={{
//                 uri:
//                   item.image ||
//                   "https://cdn-icons-png.flaticon.com/512/201/201623.png",
//               }}
//               style={styles.image}
//             />
//             <View style={styles.textBox}>
//               <Text style={styles.text}>{item.name}</Text>
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
//     marginTop: 32,
//     backgroundColor: "#93210A",
//   },
//   title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
//   card: {
//     marginBottom: 15,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     elevation: 3,
//     overflow: "hidden",
//   },
//   image: { width: "100%", height: 150, borderRadius: 10 },
//   textBox: {
//     backgroundColor: "#f5f5f5",
//     padding: 10,
//     alignItems: "center",
//   },
//   text: { fontSize: 16, fontWeight: "bold", color: "#333" },
//   container: { flex: 1, backgroundColor: "#fff" },
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
import { useNavigation } from "@react-navigation/native";
import { fetchTourismTypes } from "../../../Controller/TourismController/TourismController";

export default function TourismPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTourismTypes();
        setTypes(data);
      } catch (error) {
        console.error("Error loading types:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  const numColumns = isTablet ? 2 : 1;

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 34 : 28}
            color="#fff"
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          Tourist Places
        </Text>
      </View>

      {/* 🔹 Grid */}
      <FlatList
        data={types}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          isTablet && styles.listTablet,
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isTablet && styles.cardTablet,
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("TourismPage2", {
                typeId: item.id,
                typeName: item.name,
              })
            }
          >
            <Image
              source={{
                uri:
                  item.image ||
                  "https://cdn-icons-png.flaticon.com/512/201/201623.png",
              }}
              style={[
                styles.image,
                isTablet && styles.imageTablet,
              ]}
            />

            <View
              style={[
                styles.textBox,
                isTablet && styles.textBoxTablet,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  isTablet && styles.textTablet,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
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
  list: {
    padding: 15,
    paddingBottom: 30,
  },
  listTablet: {
    paddingHorizontal: 28,
    paddingTop: 24,
  },

  /* 🔹 Card */
  card: {
    flex: 1,
    marginBottom: 15,
    marginHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
  },
  cardTablet: {
    marginBottom: 24,
    borderRadius: 16,
  },

  /* 🔹 Image */
  image: {
    width: "100%",
    height: 150,
  },
  imageTablet: {
    height: 220,
  },

  /* 🔹 Text Box */
  textBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    alignItems: "center",
  },
  textBoxTablet: {
    paddingVertical: 16,
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  textTablet: {
    fontSize: 20,
  },
});




