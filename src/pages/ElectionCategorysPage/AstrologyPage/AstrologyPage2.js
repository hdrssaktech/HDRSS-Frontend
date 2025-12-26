// // src/pages/Astrology/AstrologyPage2.js
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";
// import { fetchAstrologyByType } from "../../../Controller/AstrologyController/AstrologyController";

// export default function AstrologyPage2({ route }) {
//   const navigation = useNavigation();
//   const [astrologyData, setAstrologyData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const typeId = route?.params?.typeId || 1;

//   useEffect(() => {
//     const loadAstrologyDetails = async () => {
//       try {
//         const data = await fetchAstrologyByType(typeId);
//         setAstrologyData(data);
//       } catch (error) {
//         console.error("Error loading astrology data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadAstrologyDetails();
//   }, [typeId]);

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Astrology Details</Text>
//       </View>

//       {/* 🔹 Content */}
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#93210A" style={{ marginTop: 50 }} />
//         ) : astrologyData.length === 0 ? (
//           <Text style={styles.emptyText}>No astrology data found.</Text>
//         ) : (
//           astrologyData.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.card}
//               onPress={() => navigation.navigate("AstrologyPage3", { astrologyItem: item })}
//             >
//               <Image source={{ uri: item.image }} style={styles.image} />
//               <Text style={styles.name}>{item.name}</Text>
//               <Text style={styles.title}>{item.title}</Text>
//             </TouchableOpacity>
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
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//     marginLeft: 12,
//   },
//   scrollContainer: { padding: 16 },
//   card: {
//     backgroundColor: "#FFF7F5",
//     borderRadius: 15,
//     padding: 16,
//     alignItems: "center",
//     elevation: 3,
//     marginBottom: 20,
//   },
//   image: {
//     width: 220,
//     height: 150,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 15,
//     color: "#333",
//     textAlign: "center",
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#93210A",
//     textAlign: "center",
//     marginTop: 40,
//   },
// });






// src/pages/Astrology/AstrologyPage2.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { fetchAstrologyByType } from "../../../Controller/AstrologyController/AstrologyController";

export default function AstrologyPage2({ route }) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const astrologyType = route.params.astrologyType;
  const typeId = astrologyType.id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchAstrologyByType(typeId);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [typeId]);

  const numColumns = isTablet ? 3 : 2;

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            isTablet && styles.headerTitleTablet,
          ]}
        >
          {astrologyType.name}
        </Text>
      </View>

      {/* 🔹 CONTENT */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#93210A"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={data}
          numColumns={numColumns}
          key={numColumns}
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
                navigation.navigate("AstrologyPage3", {
                  astrologyItem: item,
                })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.image,
                  isTablet && styles.imageTablet,
                ]}
              />

              <Text
                style={[
                  styles.name,
                  isTablet && styles.nameTablet,
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.title,
                  isTablet && styles.titleTablet,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  /* 🔹 CONTAINER */
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* 🔴 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },

  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 25,
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

  /* 📜 LIST */
  list: {
    padding: 12,
    paddingBottom: 30,
  },

  listTablet: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* 🟧 CARD */
  card: {
    flex: 1,
    backgroundColor: "#FFF7F5",
    borderRadius: 14,
    padding: 12,
    margin: 6,
    alignItems: "center",
    elevation: 3,
  },

  cardTablet: {
    padding: 18,
    margin: 10,
    borderRadius: 18,
  },

  /* 🖼️ IMAGE */
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },

  imageTablet: {
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
  },

  /* 🏷️ NAME */
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
    marginBottom: 4,
  },

  nameTablet: {
    fontSize: 20,
  },

  /* 📝 TITLE */
  title: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  },

  titleTablet: {
    fontSize: 16,
    lineHeight: 22,
  },
});
