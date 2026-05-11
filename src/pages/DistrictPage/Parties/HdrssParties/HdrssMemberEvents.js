// import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import { Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Loader from '../../../../components/Alert/Loader';

// const HdrssMemberEvents = () => {
//     const route = useRoute();
//     const { districtId } = route.params || {};
//     const navigation = useNavigation();
//     console.log(districtId)
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (districtId) {
//             fetchEvents();
//         } else {
//             setError("District ID not found");
//             setLoading(false);
//         }
//     }, [districtId]);

//     const fetchEvents = async () => {
//         try {
//             console.log("Fetching events for:", districtId);

//             setLoading(true);
//             setError(null);

//             const response = await axios.get(
//                 `https://hdrss-backend.onrender.com/api/members-events/district/${districtId}`,
//                 {
//                     timeout: 15000, // prevents infinite loading
//                 }
//             );

//             console.log("API Response:", response.data);

//             if (response.data?.message === "Member events fetched successfully") {
//                 setEvents(Array.isArray(response.data.data) ? response.data.data : []);
//             } else {
//                 throw new Error(response.data?.message || "Failed to fetch events");
//             }

//         } catch (err) {
//             console.error("Axios Error:", err);

//             if (err.code === "ECONNABORTED") {
//                 setError("Server is taking too long (maybe sleeping on Render)");
//             } else if (err.response) {
//                 setError(err.response.data?.message || "Server error");
//             } else if (err.request) {
//                 setError("No response from server");
//             } else {
//                 setError(err.message);
//             }

//         } finally {
//             setLoading(false);
//         }
//     };

// const renderEventItem = ({ item }) => (
//     <TouchableOpacity
//         style={styles.eventCard}
//         onPress={() =>
//             navigation.navigate("HDRSSMembereventsdetails", {
//                 event: item, // 👈 pass full event
//             })
//         }
//     >
//         <Image
//             source={{ uri: item.image }} // 👈 API image
//             style={styles.eventImage}
//         />

//         <Text style={styles.eventTitle}>
//             {item.title || 'Event Title'}
//         </Text>
//     </TouchableOpacity>
// );

//     // 🔄 Loading UI
//     if (loading) {
//         return (
//           <Loader/>
//         );
//     }

//     // ❌ Error UI
//     if (error) {
//         return (
//             <View style={styles.centerContainer}>
//                 <Text style={styles.errorText}>Error: {error}</Text>

//                 {/* Retry Button */}
//                 <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
//                     <Text style={styles.retryText}>Retry</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     // ✅ Main UI
//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>
//                 Member Events - District {districtId}
//             </Text>

//             {events.length === 0 ? (
//                 <View style={styles.centerContainer}>
//                     <Text>No events found for this district</Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={events}
//                     renderItem={renderEventItem}
//                     keyExtractor={(item, index) =>
//                         item.id?.toString() || index.toString()
//                     }
//                     contentContainerStyle={styles.listContainer}
//                     showsVerticalScrollIndicator={false}
//                 />
//             )}
//         </View>
//     );
// };

// export default HdrssMemberEvents;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     centerContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     header: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         padding: 16,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//     },
//     listContainer: {
//         padding: 16,
//     },
//     eventCard: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 16,
//         marginBottom: 12,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     eventTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#333',
//     },
//     eventDescription: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 8,
//         lineHeight: 20,
//     },
//     eventDate: {
//         fontSize: 12,
//         color: '#888',
//         marginTop: 4,
//     },
//     eventLocation: {
//         fontSize: 12,
//         color: '#888',
//         marginTop: 2,
//     },
//     errorText: {
//         color: 'red',
//         fontSize: 16,
//         textAlign: 'center',
//         marginBottom: 10,
//     },
//     eventImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 8,
//     marginBottom: 10,
// },
//     retryButton: {
//         backgroundColor: '#007bff',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 6,
//     },
//     retryText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
// });


import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Platform ,SafeAreaView,StatusBar } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../../../../components/Alert/Loader';

const { width, height } = Dimensions.get('window');

const HdrssMemberEvents = () => {
    const route = useRoute();
    const { districtId, districtName } = route.params || {};
    const navigation = useNavigation();
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Responsive design
    const isTablet = useMemo(() => {
        return width >= 600 || (width > height && width >= 600);
    }, [width, height]);

    const numColumns = useMemo(() => (isTablet ? 3 : 2), [isTablet]);
    const gap = 16;
    const horizontalPadding = 32; // 16 * 2
    const totalGap = (numColumns - 1) * gap;
    const cardWidth = (width - horizontalPadding - totalGap) / numColumns;

    useEffect(() => {
        if (districtId) {
            fetchEvents();
        } else {
            setError("District ID not found");
            setLoading(false);
        }
    }, [districtId]);

    const fetchEvents = async () => {
        try {
            // console.log("Fetching events for:", districtId);
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `https://hdrss-backend.onrender.com/api/members-events/district/${districtId}`,
                { timeout: 15000 }
            );

            // console.log("API Response:", response.data);

            if (response.data?.message === "Member events fetched successfully") {
                setEvents(Array.isArray(response.data.data) ? response.data.data : []);
            } else {
                throw new Error(response.data?.message || "Failed to fetch events");
            }

        } catch (err) {
            console.error("Axios Error:", err);

            if (err.code === "ECONNABORTED") {
                setError("Server is taking too long (maybe sleeping on Render)");
            } else if (err.response) {
                setError(err.response.data?.message || "Server error");
            } else if (err.request) {
                setError("No response from server");
            } else {
                setError(err.message);
            }

        } finally {
            setLoading(false);
        }
    };

    const formatEventDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            year: date.getFullYear(),
            formatted: date.toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            })
        };
    };

    const renderEventItem = ({ item, index }) => {
        const isLastInRow = (index + 1) % numColumns === 0;
        const eventDate = formatEventDate(item.date);
        
        return (
            <TouchableOpacity
                style={[
                    styles.eventCard,
                    isTablet && styles.eventCardTablet,
                    {
                        width: cardWidth,
                        marginRight: !isLastInRow ? gap : 0,
                        marginBottom: gap,
                    }
                ]}
                activeOpacity={0.85}
                onPress={() =>
                    navigation.navigate("HDRSSMembereventsdetails", {
                        event: item,
                    })
                }
            >
                <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
                    <Image
                        source={{ uri: item.image || "https://via.placeholder.com/400x250/f0f0f0/8B0000?text=Event" }}
                        style={styles.eventImage}
                        resizeMode="cover"
                    />
                    
                    {/* Date Badge on Image */}
                    {eventDate && (
                        <View style={styles.dateBadge}>
                            <Text style={styles.dateDay}>{eventDate.day}</Text>
                            <Text style={styles.dateMonth}>{eventDate.month}</Text>
                        </View>
                    )}
                    
                    {item.eventType && (
                        <View style={styles.eventTypeBadge}>
                            <Text style={styles.eventTypeText}>{item.eventType}</Text>
                        </View>
                    )}
                </View>

                <View style={[styles.cardContent, isTablet && styles.cardContentTablet]}>
                    <View style={styles.textWrapper}>
                        <Text style={[styles.eventTitle, isTablet && styles.eventTitleTablet]} numberOfLines={2}>
                            {item.title || 'Event Title'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={[styles.header, isTablet && styles.headerTablet]}>
            <TouchableOpacity
                style={[styles.backButton, isTablet && styles.backButtonTablet]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTitleWrap}>
                <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
                    Member Events
                </Text>
                {districtName && (
                    <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]} numberOfLines={1}>
                        HDRSS • {districtName}
                    </Text>
                )}
            </View>
            
            <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
        </View>
    );

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
                <Ionicons name="alert-circle-outline" size={isTablet ? 60 : 50} color="#8B0000" />
                <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>
                    {error}
                </Text>
                <TouchableOpacity style={[styles.retryButton, isTablet && styles.retryButtonTablet]} onPress={fetchEvents}>
                    <Text style={[styles.retryText, isTablet && styles.retryTextTablet]}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
            <View style={styles.container}>
                {renderHeader()}
                
                {events.length === 0 ? (
                    <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
                        <Ionicons name="calendar-outline" size={isTablet ? 60 : 50} color="#8B0000" />
                        <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
                            No events found
                        </Text>
                        <Text style={[styles.emptySubText, isTablet && styles.emptySubTextTablet]}>
                            Check back later for upcoming events
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={events}
                        renderItem={renderEventItem}
                        key={`${numColumns}_${width}`}
                        numColumns={numColumns}
                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                        contentContainerStyle={[
                            styles.listContainer,
                            isTablet && styles.listContainerTablet
                        ]}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={{ height: isTablet ? 40 : 30 }} />}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default HdrssMemberEvents;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#8B0000",
    },
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    centerContainerTablet: {
        padding: 40,
    },
    
    // Header Styles
    header: {
        backgroundColor: "#8B0000",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "ios" ? 50 : 40,
        paddingBottom: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerTablet: {
        paddingHorizontal: 32,
        paddingTop: Platform.OS === "ios" ? 60 : 50,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    backButtonTablet: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerTitleWrap: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 10,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "900",
        textAlign: "center",
    },
    headerTitleTablet: {
        fontSize: 26,
    },
    subTitle: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 12,
        fontWeight: "600",
        marginTop: 4,
        textAlign: "center",
    },
    subTitleTablet: {
        fontSize: 14,
        marginTop: 6,
    },
    headerSpacer: {
        width: 40,
    },
    headerSpacerTablet: {
        width: 50,
    },
    
    // List Container
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    listContainerTablet: {
        paddingHorizontal: 32,
        paddingTop: 20,
        paddingBottom: 20,
    },
    
    // Event Card
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    eventCardTablet: {
        borderRadius: 14,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    imageContainer: {
        width: '100%',
        height: 120,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        position: 'relative',
    },
    imageContainerTablet: {
        height: 140,
    },
    
    eventImage: {
        width: '100%',
        height: '100%',
    },
    
    dateBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#8B0000',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    
    dateDay: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 18,
    },
    
    dateMonth: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    
    eventTypeBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    
    eventTypeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '600',
    },
    
    cardContent: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 65,
    },
    cardContentTablet: {
        padding: 12,
        minHeight: 75,
    },
    
    textWrapper: {
        flex: 1,
        paddingRight: 8,
    },
    
    eventTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#8B0000",
        marginBottom: 4,
        lineHeight: 18,
    },
    eventTitleTablet: {
        fontSize: 14,
        marginBottom: 5,
        lineHeight: 20,
    },

    arrowContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    errorText: {
        marginTop: 14,
        color: '#8B0000',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    errorTextTablet: {
        fontSize: 20,
        lineHeight: 26,
        marginTop: 20,
        maxWidth: 500,
    },
    
    emptyText: {
        marginTop: 12,
        color: '#8B0000',
        fontSize: 18,
        fontWeight: '700',
    },
    emptyTextTablet: {
        fontSize: 22,
        marginTop: 16,
    },
    
    emptySubText: {
        marginTop: 8,
        color: '#777',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    emptySubTextTablet: {
        fontSize: 16,
        marginTop: 10,
    },
    
    retryButton: {
        marginTop: 20,
        backgroundColor: '#8B0000',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 3,
    },
    retryButtonTablet: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 24,
    },
    retryText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    retryTextTablet: {
        fontSize: 17,
    },
});