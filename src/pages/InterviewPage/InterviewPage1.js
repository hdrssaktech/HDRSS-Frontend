// import React from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { INTERVIEW_DATA} from "./Interviewdata";
// import YoutubePlayer from "react-native-youtube-iframe";
// const videos = [
//   { id: 1, videoId: "6cT4SV2xhRg", title: "Interview 1" },];
// const ListCard = ({ item, onPress }) => (
  
//   <TouchableOpacity style={styles.listCardRow1} onPress={onPress}>
//     {/* News Image */}
//     <Image source={item.image} style={styles.listCardImage1} />

//     {/* News Content */}
//     <View style={styles.listCardContent1}>
//       <Text style={styles.listCardCategory}>{item.category}</Text>
//       <Text style={styles.listCardTitle1} numberOfLines={2}>
//         {item.title}
//       </Text>
//       <Text style={styles.listCardDescription1} numberOfLines={2}>
//         {item.excerpt}
//       </Text>
//     </View>
//   </TouchableOpacity>
// );

// export default function InterviewPage1() {
//   const navigation = useNavigation();
  
//   return (
//     <SafeAreaView style={styles.mainContainer1}>
//       <StatusBar barStyle="light-content" />

//       {/* 🔹 Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name="arrow-back"
//           size={24}
//           color="#fff"
//           onPress={() => navigation.goBack()}
//         />
//         <Text style={styles.headerTitle1}>Latest Videos</Text>
//       </View>

//       {/* 🔹 News List */}
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {INTERVIEW_DATA.map((item) => (
//           <ListCard key={item.id} item={item}  onPress={()=>navigation.navigate("InterviewPage2")} />
          
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer1: {
//     flex: 1,
//     backgroundColor: "#f4f4f4", // light gray bg
//   },

//   // 🔹 Header
//   header: {
//      flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     marginTop: 32,
//     backgroundColor: '#93210A',
//   },
//   headerTitle1: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 20,
//     marginLeft: 10,
//   },

//   // 🔹 News Card
//   listCardRow1: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginHorizontal: 15,
//     marginTop: 12,
//     padding: 10,
//     elevation: 2, // Android shadow
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   listCardImage1: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginRight: 12,
//   },
//   listCardContent1: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   listCardCategory: {
//     fontSize: 14,
//     color: "#93210A",
//     fontWeight: "600",
//     marginBottom: 2,
//     marginHorizontal:20,
//   },
//   listCardTitle1: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#222",
//     marginBottom: 4,
//     marginHorizontal:20,
//   },
//   listCardDescription1: {
//     fontSize: 12,
//     color: "#555",
//   },
// });
