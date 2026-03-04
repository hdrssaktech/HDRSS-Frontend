// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   useWindowDimensions,
//   Image,
//   Platform
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import Loader from '../../../components/Alert/Loader';

// const DistrictAssemblyPage2 = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { districtId, districtName } = route.params || {};
//   const { width } = useWindowDimensions();
  
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const isTablet = width >= 600;
//   const numColumns = isTablet ? 3 : 2;
  
//   // Calculate card width for consistent sizing
//   const gap = 16;
//   const horizontalPadding = 32; // 16 * 2
//   const totalGap = (numColumns - 1) * gap;
//   const cardWidth = (width - horizontalPadding - totalGap) / numColumns;

//   useEffect(() => {
//     fetchRoles();
//   }, [districtId]);

//   const roleImages = {
//     Government: require("../../../../assets/Election/governmentlogo.jpeg"),
//   };

//   const fetchRoles = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`https://hdrss-backend.onrender.com/api/districtAssembly/${districtId}`);
//       const result = await response.json();
      
//       if (result.success && Array.isArray(result.data)) {
//         const uniqueMap = new Map();
//         result.data.forEach(item => {
//           if(!uniqueMap.has(item.role)){
//             uniqueMap.set(item.role, item);
//           }
//         });
        
//         setRoles(uniqueMap.size > 0 ? Array.from(uniqueMap.values()) : []);
//       } else {
//         setRoles([]);
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError('Failed to load roles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item, index }) => {
//     // Check if it's the last item in the row
//     const isLastInRow = (index + 1) % numColumns === 0;
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.roleCard,
//           isTablet && styles.roleCardTablet,
//           { 
//             width: cardWidth,
//             marginRight: !isLastInRow ? gap : 0,
//             marginBottom: gap,
//           }
//         ]}
//         activeOpacity={0.7}
//         onPress={() => {
//           navigation.navigate('DistrictAssembly3', { 
//             role: item.role,
//             districtId,
//             districtName
//           });
//         }}
//       >
//         {/* Image */}
//         <View style={[styles.iconContainer, isTablet && styles.iconContainerTablet]}>
//           <Image
//             source={roleImages.Government}
//             style={[
//               styles.roleImage,
//               isTablet && styles.roleImageTablet
//             ]}
//             resizeMode="cover"
//           />
//         </View>

//         {/* Role Name */}
//         <Text style={[styles.roleName, isTablet && styles.roleNameTablet]} numberOfLines={2}>
//           {item.role}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderHeader = () => (
//     <View style={[styles.headerContainer, isTablet && styles.headerContainerTablet]}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={[styles.backButton, isTablet && styles.backButtonTablet]}
//         >
//           <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
//         </TouchableOpacity>
        
//         <View style={styles.headerTitleContainer}>
//           <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
//             Elected Representatives
//           </Text>
//           {/* {districtName && (
//             <Text style={[styles.headerSubtitle, isTablet && styles.headerSubtitleTablet]}>
//               {districtName}
//             </Text>
//           )} */}
//          </View>
        
//         <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
//       </View>
//     </View>
//   );

//   if (loading) {
//     return <Loader />;
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Ionicons name="alert-circle-outline" size={60} color="#8B0000" />
//         <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>{error}</Text>
//         <TouchableOpacity 
//           style={[styles.retryButton, isTablet && styles.retryButtonTablet]} 
//           onPress={fetchRoles}
//         >
//           <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
//             Retry
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      
//       {renderHeader()}
      
//       <FlatList
//         data={roles}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => item.role + index}
//         numColumns={numColumns}
//         key={numColumns} // Force re-render when columns change
//         contentContainerStyle={[styles.listContainer, isTablet && styles.listContainerTablet]}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="people-outline" size={60} color="#ccc" />
//             <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
//               No roles found
//             </Text>
//           </View>
//         }
//         ListFooterComponent={<View style={{ height: isTablet ? 40 : 30 }} />}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#FFFFFF' 
//   },
  
//   // Header
//   headerContainer: {
//     backgroundColor: '#8B0000',
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//     paddingBottom: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   headerContainerTablet: {
//     paddingTop: Platform.OS === 'ios' ? 60 : 50,
//     paddingBottom: 25,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
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
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     alignItems: 'center', 
//     justifyContent: 'center',
//   },
//   backButtonTablet: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   headerTitleContainer: { 
//     alignItems: 'center', 
//     flex: 1 
//   },
//   headerTitle: { 
//     color: '#fff', 
//     fontSize: 18, 
//     fontWeight: 'bold' 
//   },
//   headerTitleTablet: { 
//     fontSize: 22 
//   },
//   headerSubtitle: { 
//     color: 'rgba(255, 255, 255, 0.9)', 
//     fontSize: 14, 
//     marginTop: 4,
//     fontWeight: '500',
//   },
//   headerSubtitleTablet: { 
//     fontSize: 16,
//     marginTop: 6,
//   },
//   headerSpacer: { 
//     width: 40 
//   },
//   headerSpacerTablet: {
//     width: 50,
//   },

//   // List Container
//   listContainer: { 
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   listContainerTablet: {
//     paddingHorizontal: 32,
//     paddingTop: 25,
//   },

//   // Role Card
//   roleCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: 'rgba(139, 0, 0, 0.1)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   roleCardTablet: { 
//     padding: 20,
//     borderRadius: 18,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 5,
//   },
  
//   iconContainer: {
//     width: 100,
//     height: 100,
//     alignItems: 'center', 
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   iconContainerTablet: { 
//     width: 120, 
//     height: 120,
//     marginBottom: 16,
//   },

//   roleImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   roleImageTablet: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
  
//   roleName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#8B0000',
//     textAlign: 'center',
//     width: '100%',
//   },
//   roleNameTablet: { 
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   // Center States
//   centerContainer: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     backgroundColor: '#fff',
//     padding: 20,
//   },
  
//   errorText: { 
//     marginTop: 16, 
//     color: '#8B0000', 
//     fontSize: 16, 
//     textAlign: 'center', 
//     paddingHorizontal: 40,
//     fontWeight: '500',
//   },
//   errorTextTablet: {
//     fontSize: 18,
//     marginTop: 20,
//   },
  
//   retryButton: { 
//     marginTop: 24, 
//     backgroundColor: '#8B0000', 
//     paddingHorizontal: 30, 
//     paddingVertical: 12, 
//     borderRadius: 25,
//     elevation: 3,
//   },
//   retryButtonTablet: {
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 30,
//     marginTop: 30,
//   },
//   retryButtonText: { 
//     color: '#fff', 
//     fontSize: 16, 
//     fontWeight: '600' 
//   },
//   retryButtonTextTablet: {
//     fontSize: 18,
//   },
  
//   emptyContainer: { 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingTop: 100,
//     paddingHorizontal: 20,
//   },
//   emptyText: { 
//     marginTop: 16, 
//     fontSize: 16, 
//     color: '#999',
//     textAlign: 'center',
//   },
//   emptyTextTablet: {
//     fontSize: 18,
//     marginTop: 20,
//   },
// });

// export default DistrictAssemblyPage2;