// import React, { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { fetchNews } from "../../Controller/NewsController/NewsController";   // ✅ import controller

// // 🔹 Card Component
// const ListCard = ({ item, onPress }) => (
//   <TouchableOpacity style={styles.listCardRow1} onPress={onPress}>
//     <Image source={{ uri: item.image }} style={styles.listCardImage1} />
//     <View style={styles.listCardContent1}>
//       <Text style={styles.listCardCategory}>{item.type}</Text>
//       <Text style={styles.listCardTitle1} numberOfLines={2}>
//         {item.title}
//       </Text>
//       {/* 🔸 Removed description line */}
//     </View>
//   </TouchableOpacity>
// );

// export default function NewsPage1() {
//   const navigation = useNavigation();
//   const [news, setNews] = useState([]);   // ✅ renamed state to `news`
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadNews = async () => {
//       const data = await fetchNews();
//       setNews(data);     // ✅ assign API result to state
//       setLoading(false);
//     };
//     loadNews();
//   }, []);

//   return (
//     <SafeAreaView style={styles.mainContainer1}>
//       <StatusBar barStyle="light-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name="arrow-back"
//           size={24}
//           color="#fff"
//           onPress={() => navigation.goBack()}
//         />
//         <Text style={styles.headerTitle1}>Latest News</Text>
//       </View>

//       {/* Loader */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#93210A" style={{ marginTop: 20 }} />
//       ) : (
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {news.map((item) => (
//             <ListCard
//               key={item.id}
//               item={item}
//               onPress={() => navigation.navigate("Newspage2", { news: item })}
//             />
//           ))}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer1: { flex: 1, backgroundColor: "#f4f4f4" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginTop: 32,
//     backgroundColor: "#93210A",
//   },
//   headerTitle1: { color: "white", fontWeight: "bold", fontSize: 20, marginLeft: 19},
//   listCardRow1: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginHorizontal: 15,
//     marginTop: 25,
//     padding: 10,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
    
//   },
//   listCardImage1: { width: 100, height: 100, borderRadius: 10, marginRight: 12 },
//   listCardContent1: { flex: 1, justifyContent: "center" },
//   listCardCategory: { fontSize: 12, color: "#93210A", fontWeight: "600", marginBottom: 5 },
//   listCardTitle1: { fontSize: 12, fontWeight: "bold", color: "#222", marginBottom: 15 },
 
// });






import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchNews } from "../../Controller/NewsController/NewsController";

/* 🔹 Card Component */
const ListCard = ({ item, onPress, styles }) => (
  <TouchableOpacity style={styles.listCardRow1} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.listCardImage1} />
    <View style={styles.listCardContent1}>
      <Text style={styles.listCardCategory}>{item.type}</Text>
      <Text style={styles.listCardTitle1} numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function NewsPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const styles = getStyles(isTablet);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNews();
      setNews(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer1}>
      <StatusBar barStyle="light-content" />

      {/* 🔹 Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={isTablet ? 30 : 24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle1}>Latest News</Text>
      </View>

      {/* 🔹 Loader */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#93210A"
          style={{ marginTop: 30 }}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {news.map((item) => (
            <ListCard
              key={item.id}
              item={item}
              styles={styles}
              onPress={() =>
                navigation.navigate("Newspage2", { news: item })
              }
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const getStyles = (isTablet) =>
  StyleSheet.create({
    mainContainer1: {
      flex: 1,
      backgroundColor: "#f4f4f4",
    },

    /* 🔹 Header */
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: 16,
      paddingTop: 40,
      backgroundColor: "#93210A",
      elevation: 4,
    },

    headerTitle1: {
      color: "white",
      fontWeight: "bold",
      fontSize: isTablet ? 26 : 20,
      marginLeft: 20,
      left: isTablet ? 200 : 55,
     
    },

    /* 🔹 News Card */
    listCardRow1: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 14,
      marginHorizontal: isTablet ? 30 : 13,
      marginTop: isTablet ? 30 : 25,
      padding: isTablet ? 16 : 10,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },

    listCardImage1: {
      width: isTablet ? 140 : 100,
      height: isTablet ? 140 : 100,
      borderRadius: 12,
      marginRight: 16,
    },

    listCardContent1: {
      flex: 1,
      justifyContent: "center",
    },

    listCardCategory: {
      fontSize: isTablet ? 16 : 12,
      color: "#93210A",
      fontWeight: "600",
      marginBottom: 6,
    },

    listCardTitle1: {
      fontSize: isTablet ? 18 : 12,
      fontWeight: "bold",
      color: "#222",
      lineHeight: isTablet ? 26 : 18,
    },
  });
