// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   useWindowDimensions,
//   Platform
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import Loader from '../../../components/Alert/Loader';

// const DistrictAssemblyPage1 = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { districtId, districtName } = route.params || {};
//   const { width } = useWindowDimensions();
  
//   const [parties, setParties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const isTablet = width >= 600;
//   const numColumns = isTablet ? 4 : 3;

//   useEffect(() => {
//     fetchParties();
//   }, [districtId]);

//   const fetchParties = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`https://hdrss-backend.onrender.com/api/districtAssembly/${districtId}`);
//       const result = await response.json();
      
//       if (result.success && Array.isArray(result.data)) {
//         // Get unique parties by title
//         const uniqueMap = new Map();
//         result.data.forEach(item => {
//           if (!uniqueMap.has(item.title)) {
//             uniqueMap.set(item.title, item);
//           }
//         });
//         setParties(Array.from(uniqueMap.values()));
//       } else {
//         setParties([]);
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError('Failed to load parties');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPartyColor = (title) => {
//     const colors = {
//       'BJP': '#FF9933',
//       'DMK': '#E11B22',
//       'AIADMK': '#155F2C',
//       'Congress': '#00BFFF',
//       'default': '#8B0000'
//     };
//     return colors[title] || colors.default;
//   };

//   const renderItem = ({ item, index }) => {
//     const partyColor = getPartyColor(item.title);
    
//     // Calculate circle size based on screen width
//     const circleSize = (width - (isTablet ? 64 : 32) - (numColumns - 1) * 20) / numColumns;
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.card,
//           { 
//             width: circleSize,
//             marginLeft: index % numColumns !== 0 ? 20 : 0,
//             marginBottom: 25,
//           }
//         ]}
//         activeOpacity={0.6}
//         onPress={() => {
//           navigation.navigate('DistrictAssembly2', { 
//             partyTitle: item.title,
//             districtId,
//             districtName
//           });
//         }}
//       >
//         <View style={[styles.circleContainer, { borderColor: partyColor }]}>
//           <Image 
//             source={{ uri: item.bannerImage }}
//             style={[styles.circleImage, { width: circleSize * 0.8, height: circleSize * 0.8 }]}
//             resizeMode="cover"
//           />
//         </View>
        
//         <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
//           {item.title}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderHeader = () => (
//     <View style={styles.headerContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity
//         style={[styles.backButton, isTablet && styles.backButtonTablet]}
//         onPress={() => navigation.goBack()}
//       >
//         <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
//       </TouchableOpacity>
        
//         <View style={styles.headerTitleContainer}>
//           <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
//             Assembly
//           </Text>
//           {districtName && (
//             <Text style={[styles.headerSubtitle, isTablet && styles.headerSubtitleTablet]}>
//               {districtName}
//             </Text>
//           )}
//         </View>
        
//         <View style={styles.headerSpacer} />
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//      <Loader/>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Ionicons name="alert-circle-outline" size={60} color="#8B0000" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={fetchParties}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      
//       {renderHeader()}
      
//       <FlatList
//         data={parties}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={numColumns}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="people-outline" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>No parties found</Text>
//           </View>
//         }
//         ListFooterComponent={<View style={{ height: 30 }} />}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   headerContainer: {
//     backgroundColor: '#8B0000',
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//     paddingBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitleContainer: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   headerTitleTablet: {
//     fontSize: 26,
//   },
//   headerSubtitle: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   headerSubtitleTablet: {
//     fontSize: 14,
//   },
//   headerSpacer: {
//     width: 40,
//   },
//   listContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   card: {
//     alignItems: 'center',
//   },
//   circleContainer: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 1000,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 8,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   circleImage: {
//     borderRadius: 1000,
//   },
//   title: {
//     marginTop: 12,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//     paddingHorizontal: 5,
//   },
//   titleTablet: {
//     fontSize: 17,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   loadingText: {
//     marginTop: 12,
//     color: '#8B0000',
//     fontSize: 16,
//   },
//   errorText: {
//     marginTop: 12,
//     color: '#8B0000',
//     fontSize: 16,
//     textAlign: 'center',
//     paddingHorizontal: 40,
//   },
//   retryButton: {
//     marginTop: 20,
//     backgroundColor: '#8B0000',
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 100,
//   },
//   emptyText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#999',
//   },
// });

// export default DistrictAssemblyPage1;