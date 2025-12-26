// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { fetchHistoryByTypeId } from "../../../Controller/HistoryController/HistoryController";

// const { width } = Dimensions.get("window");
// const cardWidth = (width - 40) / 2;

// export default function HistoryPage2() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { id, name } = route.params;
//   const [historyItems, setHistoryItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       const data = await fetchHistoryByTypeId(id);
//       setHistoryItems(data);
//       setLoading(false);
//     };
//     load();
//   }, [id]);

//   if (loading)
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate("HistoryPage3", { data: item })}
//     >
//       <Image source={{ uri: item.bannerImage }} style={styles.image} />
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.phone}>{item.phone}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="chevron-back" size={26} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{name}</Text>
//       </View>

//       {/* List */}
//       <FlatList
//         data={historyItems}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     paddingVertical: 14,
//     paddingHorizontal: 15,
//     marginTop: 32,
//   },
//   backButton: { marginRight: 10 },
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
//   listContainer: { padding: 10 },
//   card: {
//     width: cardWidth,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     margin: 8,
//     paddingBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   image: { width: "100%", height: 120, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
//   title: {
//     fontSize: 15,
//     fontWeight: "bold",
//     color: "#333",
//     marginTop: 8,
//     textAlign: "center",
//   },
//   phone: {
//     fontSize: 13,
//     color: "#555",
//     textAlign: "center",
//     marginTop: 2,
//   },
// });






import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchHistoryByTypeId } from "../../../Controller/HistoryController/HistoryController";

export default function HistoryPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const numColumns = isTablet ? 3 : 2;
  const cardWidth = (width - (numColumns + 1) * 16) / numColumns;

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchHistoryByTypeId(id);
      setHistoryItems(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => navigation.navigate("HistoryPage3", { data: item })}
    >
      <Image source={{ uri: item.bannerImage }} style={styles.image} />
      <Text style={[styles.title, isTablet && styles.titleTablet]}>
        {item.title}
      </Text>
      <Text style={[styles.phone, isTablet && styles.phoneTablet]}>
        {item.phone}
      </Text>
    </TouchableOpacity>
  );

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
          {name}
        </Text>
      </View>

      {/* 🔹 LIST */}
      <FlatList
        data={historyItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns} // 🔑 important when switching layout
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop:-3,
  },

  backButton: {
    marginRight: 10,
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

  /* 🔹 LIST */
  listContainer: {
    padding: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 8,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },

  titleTablet: {
    fontSize: 18,
    bottom:-32,
  },

  phone: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginTop: 2,
  },

  phoneTablet: {
    fontSize: 15,
  },
});
