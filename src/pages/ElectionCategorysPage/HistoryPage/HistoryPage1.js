// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { fetchHistoryTypes } from "../../../Controller/HistoryController/HistoryController";

// export default function HistoryPage1() {
//   const navigation = useNavigation();
//   const [types, setTypes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       const data = await fetchHistoryTypes();
//       setTypes(data);
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity  onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Ionicons name="chevron-back" size={26} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>History</Text>
       
//       </View>

//       {types.map((item) => (
//         <TouchableOpacity
//           key={item.id}
//           style={styles.card}
//           onPress={() => navigation.navigate("HistoryPage2", { id: item.id, name: item.name })}
//         >
//           <Image source={{ uri: item.image }} style={styles.image} />
//           <View style={{ flex: 1, marginLeft: 10 }}>
//             <Text style={styles.title}>{item.name}</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#93210A" />
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {  flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     paddingVertical: 14,
//     paddingHorizontal: 15,
//     marginTop: 32, },
//   backButton: { marginBottom: 4 },
//   headerTitle: { color: "#fff", fontWeight: "700", fontSize: 22 },
//   headerText: { color: "#fff", fontSize: 13, marginTop: 8 },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     margin: 12,
//     padding: 12,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   image: { width: 80, height: 80, borderRadius: 10 },
//   title: { fontSize: 16, fontWeight: "600", color: "#000" },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchHistoryTypes } from "../../../Controller/HistoryController/HistoryController";

export default function HistoryPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHistoryTypes();
      setTypes(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={isTablet ? 30 : 26}
            color="white"
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          History
        </Text>
      </View>

      {/* 🔹 GRID LIST */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {types.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              isTablet && styles.cardTablet,
            ]}
            onPress={() =>
              navigation.navigate("HistoryPage2", {
                id: item.id,
                name: item.name,
              })
            }
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: item.image }}
              style={[
                styles.image,
                isTablet && styles.imageTablet,
              ]}
            />

            <View style={styles.textWrap}>
              <Text
                style={[
                  styles.title,
                  isTablet && styles.titleTablet,
                ]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={isTablet ? 24 : 20}
              color="#93210A"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* 🔴 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginTop: 32,
  },

  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 25,
    marginTop: -3,
  },

  backButton: {
    marginRight: 12,
  },

  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,  marginLeft: 65,
    padding:8,
   

  },

  headerTitleTablet: {
    fontSize: 28,
    padding:8,
    left:125
  
  },

  /* 🔹 GRID CONTAINER */
  listContainer: {
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* 🔹 CARD */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%", // 📱 MOBILE → 1 COLUMN
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },

  cardTablet: {
    width: "48%", // 📲 TABLET → 2 COLUMNS
    padding: 20,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  imageTablet: {
    width: 110,
    height: 110,
  },

  textWrap: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  titleTablet: {
    fontSize: 18,
   

  },

  /* 🔄 LOADER */
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

