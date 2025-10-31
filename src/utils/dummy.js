// //tils/generateIdCard.js
// import * as Print from "expo-print";
// import * as Sharing from "expo-sharing";

// export async function generateIdCard(member) {
//   const htmlContent = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             width: 350px;
//             height: 550px;
//             border: 2px solid #93210A;
//             margin: 0;
//             padding: 0;
//           }
//           .header {
//             background-color: #93210A;
//             text-align: center;
//             color: white;
//             padding: 6px 0;
//           }
//           .header h2 {
//             font-size: 18px;
//             margin: 2px 0;
//           }
//           .photo-box {
//             width: 120px;
//             height: 150px;
//             border: 2px solid #93210A;
//             margin: 10px auto;
//           }
//           .photo-box img {
//             width: 100%;
//             height: 100%;
//             object-fit: cover;
//           }
//           .details {
//             padding: 10px 20px;
//             font-size: 14px;
//             line-height: 1.4;
//           }
//           .details span {
//             font-weight: bold;
//           }
//           .footer {
//             text-align: right;
//             padding: 10px 20px;
//             font-size: 13px;
//           }
//           .footer img {
//             width: 120px;
//             margin-top: 10px;
//           }
//           .reg {
//             font-size: 13px;
//             color: #93210A;
//             font-weight: bold;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h2>HINDU DHARMA RAKSHA SENA</h2>
//         </div>

//         <div class="photo-box">
//           ${member.image ? `<img src="${member.image}" />` : ""}
//         </div>

//         <div class="details">
//           <p><span>Name:</span> ${member.name || ""}</p>
//           <p><span>S/O:</span> ${member.fatherOrHusbandName || ""}</p>
//           <p><span>Designation:</span> ${member.designation || ""}</p>
//           <p><span>District:</span> ${member.district || ""}</p>
//           <p><span>Member ID No:</span> ${member.id || "N/A"}</p>
//         </div>

//         <div class="footer">
//           <p class="reg">Regd. No.: 152 / 2021</p>
//           <p>Authorized Signatory</p>
//         </div>
//       </body>
//     </html>
//   `;

//   // ✅ Create PDF
//   const { uri } = await Print.printToFileAsync({ html: htmlContent });
//   console.log("PDF generated:", uri);

//   // ✅ Share or download
//   if (await Sharing.isAvailableAsync()) {
//     await Sharing.shareAsync(uri);
//   } else {
//     alert("Sharing not available on this device");
//   }

//   return uri;
// }

















// import React, { useRef } from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import ViewShot from "react-native-view-shot";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import * as Print from "expo-print";

// const  generateIdCard  = ({ member }) => {
//   const viewRef = useRef();

//   const handleGeneratePDF = async () => {
//     try {
//       // 1️⃣ Capture the view as image
//       const uri = await viewRef.current.capture();
//       console.log("Captured Image:", uri);

//       // 2️⃣ Create PDF from captured image (no HTML layout)
//       const pdfContent = `
//         <html>
//           <body style="margin:0;padding:0;">
//             <img src="${uri}" style="width:100%;height:auto;" />
//           </body>
//         </html>
//       `;
//       const { uri: pdfUri } = await Print.printToFileAsync({ html: pdfContent });
//       console.log("PDF File:", pdfUri);

//       // 3️⃣ Save to local folder (optional)
//       const newPath = FileSystem.documentDirectory + "ID_Card.pdf";
//       await FileSystem.moveAsync({ from: pdfUri, to: newPath });

//       // 4️⃣ Share or open PDF
//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(newPath);
//       } else {
//         Alert.alert("Success", "PDF saved successfully at: " + newPath);
//       }
//     } catch (error) {
//       console.error("PDF Generation Error:", error);
//       Alert.alert("Error", "Failed to generate ID Card PDF");
//     }
//   };

//   return (
//     <View style={{ alignItems: "center" }}>
//       <ViewShot ref={viewRef} options={{ format: "jpg", quality: 1 }}>
//         <View style={styles.card}>
//           <View style={styles.headerContainer}>
//             <View style={styles.headerIcons}>
//               <Image source={require("../../../assets/idcard/nandi.jpg")} style={styles.icon} />
//               <Image source={require("../../../assets/idcard/om.jpg")} style={styles.omIcon} />
//               <Image source={require("../../../assets/idcard/yali.jpg")} style={styles.icon} />
//             </View>

//             <Text style={styles.headerTamil}>இந்து தர்ம ரக்ஷ சேனா</Text>
//             <Text style={styles.headerHindi}>हिन्दू धर्म रक्ष सेना</Text>
//             <Text style={styles.headerEng}>HINDU DHARMA RAKSHA SENA</Text>
//           </View>

//           <View style={styles.photoBox}>
//             {member?.image ? (
//               <Image source={{ uri: member.image }} style={styles.photo} />
//             ) : (
//               <View style={styles.emptyPhoto} />
//             )}
//           </View>

//           <View style={styles.details}>
//             {[ 
//               { label: "NAME", value: member?.name },
//               { label: "S/O", value: member?.fatherOrHusbandName },
//               { label: "DESIGNATION", value: member?.designation },
//               { label: "DISTRICT", value: member?.district },
//               { label: "MEMBER ID NO", value: member?.id },
//             ].map((item, index) => (
//               <View key={index} style={styles.detailRow}>
//                 <Text style={styles.label}>{item.label}</Text>
//                 <Text style={styles.colon}>:</Text>
//                 <Text style={styles.value}>{item.value || "__________"}</Text>
//               </View>
//             ))}
//           </View>

//           <Text style={styles.reg}>Regd. No.: 152 / 2021</Text>

//           <View style={styles.signatureContainer}>
//             <Image
//               source={require("../../../assets/idcard/sign.jpg")}
//               style={styles.signature}
//               resizeMode="contain"
//             />
//             <Text style={styles.signText}>Authorized Signatory</Text>
//           </View>
//         </View>
//       </ViewShot>

//       <TouchableOpacity onPress={handleGeneratePDF} style={styles.pdfButton}>
//         <Text style={styles.pdfButtonText}>Generate ID Card PDF</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default  generateIdCard ;

// const styles = StyleSheet.create({
//   card: {
//     width: 300,
//     borderWidth: 3,
//     borderColor: "#a63b1d",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     marginVertical: 20,
//     overflow: "hidden",
//   },
//   headerContainer: {
//     backgroundColor: "#a63b1d",
//     alignItems: "center",
//     paddingVertical: 8,
//   },
//   headerIcons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     marginBottom: 5,
//   },
//   icon: { width: 40, height: 40, resizeMode: "contain" },
//   omIcon: { width: 35, height: 35, resizeMode: "contain" },
//   headerTamil: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   headerHindi: { color: "#fff", fontSize: 18 },
//   headerEng: { color: "#fff", fontSize: 14, fontWeight: "bold" },
//   photoBox: {
//     alignSelf: "center",
//     width: 110,
//     height: 140,
//     borderWidth: 2,
//     borderColor: "#a63b1d",
//     marginTop: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   photo: { width: "100%", height: "100%", resizeMode: "cover" },
//   emptyPhoto: { width: "100%", height: "100%", backgroundColor: "#eee" },
//   details: { marginTop: 10, paddingHorizontal: 20 },
//   detailRow: { flexDirection: "row", marginBottom: 4 },
//   label: { width: 100, color: "#5a1a0c", fontWeight: "bold", fontSize: 12 },
//   colon: { marginRight: 5, color: "#5a1a0c", fontWeight: "bold" },
//   value: { color: "#5a1a0c", fontSize: 12 },
//   reg: {
//     marginLeft: 20,
//     marginTop: 5,
//     color: "#5a1a0c",
//     fontWeight: "bold",
//     fontSize: 11,
//   },
//   signatureContainer: {
//     alignItems: "flex-end",
//     marginTop: -10,
//     marginRight: 20,
//     marginBottom: 10,
//   },
//   signature: { width: 100, height: 40 },
//   signText: {
//     fontSize: 11,
//     color: "#e72828",
//     fontWeight: "bold",
//     marginTop: -5,
//   },
//   pdfButton: {
//     backgroundColor: "#a63b1d",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   pdfButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
// });



