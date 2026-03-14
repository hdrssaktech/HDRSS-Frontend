// src/Screens/EventMonthHistory.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  TextInput,
 ScrollView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export default function EventMonthHistory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { monthName, events } = route.params || {};

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  
  // State for date search
  const [searchDay, setSearchDay] = useState('');
  
  // Calculate number of columns based on screen width
  const numColumns = isTablet ? 3 : 2;
  const styles = getStyles(isTablet, numColumns);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";  
    try {
      const date = new Date(dateString); 
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return { day, month, year, full: `${day} ${month} ${year}` };
    } catch (error) {
      return { day: 0, month: '', year: 0, full: "Invalid Date" };
    }
  };

  // Filter events based on search day
  const filteredEvents = useMemo(() => {
    if (!searchDay.trim() || !events) {
      return events || [];
    }
    
    const searchDayNum = parseInt(searchDay, 10);
    
    // If not a valid number, return all events
    if (isNaN(searchDayNum)) {
      return events;
    }
    
    return events.filter(event => {
      const dateInfo = formatDate(event.date);
      return dateInfo.day === searchDayNum;
    });
  }, [searchDay, events]);

  const clearSearch = () => {
    setSearchDay('');
  };

  const handleDayPress = (day) => {
    setSearchDay(day.toString());
  };

  if (!events || events.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Ionicons name="calendar-outline" size={isTablet ? 80 : 60} color="#ccc" />
        <Text style={styles.noEventsText}>No events found for {monthName}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get unique days that have events
  const availableDays = useMemo(() => {
    const days = new Set();
    events.forEach(event => {
      const dateInfo = formatDate(event.date);
      if (dateInfo.day) {
        days.add(dateInfo.day);
      }
    });
    return Array.from(days).sort((a, b) => a - b);
  }, [events]);

  const renderEventItem = ({ item, index }) => {
    const dateInfo = formatDate(item.date);
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate("EventPage2", { event: item })}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#FFF5E1', '#ffd391']}
          style={styles.gradientCard}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.eventImage} 
            resizeMode="cover"
          />
          
          <View style={styles.cardContent}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {item.name || "Event"}
            </Text>
            
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color="#93210A" />
              <Text style={styles.eventDate} numberOfLines={1}>
                {dateInfo.full}
              </Text>
            </View>

           
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with back button only */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={isTablet ? 32 : 28} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {monthName || "Month Events"}
        </Text>
        
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Date Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, searchDay.length > 0 && styles.searchBoxActive]}>
          <Ionicons name="calendar-number" size={20} color={searchDay.length > 0 ? "#93210A" : "#999"} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by day (e.g., 15)"
            placeholderTextColor="#999"
            value={searchDay}
            onChangeText={setSearchDay}
            keyboardType="numeric"
            maxLength={2}
            returnKeyType="search"
          />
          {searchDay.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#93210A" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Quick day filters */}
        {availableDays.length > 0 && !searchDay && (
          <View style={styles.quickDaysContainer}>
          
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickDaysScroll}>
              {availableDays.map(day => (
                <TouchableOpacity
                  key={day}
                  style={styles.dayChip}
                  onPress={() => handleDayPress(day)}
                >
                  <Text style={styles.dayChipText}>Day {day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Search results count */}
        {searchDay.length > 0 && (
          <View style={styles.searchInfo}>
            
          </View>
        )}
      </View> 

      {/* No search results */}
      {searchDay.length > 0 && filteredEvents.length === 0 ? (
        <View style={styles.noSearchResults}>
          <Ionicons name="calendar-outline" size={isTablet ? 70 : 50} color="#ccc" />
          <Text style={styles.noSearchResultsText}>No events found</Text>
          <Text style={styles.noSearchResultsSubText}>
            No events on day {searchDay} in {monthName}
          </Text>
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={clearSearch}
          >
            <Text style={styles.clearSearchButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          numColumns={numColumns}
          key={`grid-${numColumns}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          ListHeaderComponent={
            searchDay.length > 0 && filteredEvents.length > 0 ? (
              <View style={styles.searchResultHeader}>
                <Text style={styles.searchResultHeaderText}>
                  Showing events on day {searchDay}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

/* ================== STYLES ================== */
const getStyles = (isTablet, numColumns) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },

    centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },

    noEventsText: {
      fontSize: isTablet ? 20 : 18,
      color: "#666",
      marginTop: 15,
      marginBottom: 20,
      textAlign: "center",
    },

    /* Header Styles */
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: isTablet ? 20 : 16,
      paddingTop: isTablet ? 45 : 40,
      backgroundColor: "#93210A",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },

    backButton: {
      padding: isTablet ? 8 : 5,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 20,
      width: isTablet ? 50 : 40,
      height: isTablet ? 50 : 40,
      justifyContent: 'center',
      alignItems: 'center',
    },

    headerTitle: { 
      color: "#fff",
      fontWeight: "bold",
      fontSize: isTablet ? 26 : 20,
      textAlign: "center",
      flex: 1,
      marginHorizontal: 10,
    },

    headerRightPlaceholder: {
      width: isTablet ? 50 : 40,
      height: isTablet ? 50 : 40,
    },

    /* Date Search Bar Styles */
    searchContainer: {
      paddingHorizontal: isTablet ? 20 : 16,
      paddingTop: isTablet ? 20 : 15,
      paddingBottom: isTablet ? 15 : 12,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },

    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      borderRadius: 15,
      paddingHorizontal: 18,
      paddingVertical: isTablet ? 14 : 12,
      borderWidth: 1,
      borderColor: '#e8e8e8',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },

    searchBoxActive: {
      borderColor: '#93210A',
      backgroundColor: '#fff',
    },

    searchInput: {
      flex: 1,
      fontSize: isTablet ? 18 : 16,
      color: '#333',
      paddingHorizontal: 12,
      paddingVertical: 0,
    },

    clearButton: {
      padding: 4,
    },

    /* Quick Days Styles */
    quickDaysContainer: {
      marginTop: 12,
    },
    quickDaysLabel: {
      fontSize: isTablet ? 14 : 13,
      color: '#666',
      marginBottom: 8,
      fontWeight: '500',
    },
    quickDaysScroll: {
      flexDirection: 'row',
    },
    dayChip: {
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#93210A',
    },
    dayChipText: {
      color: '#93210A',
      fontSize: isTablet ? 14 : 13,
      fontWeight: '600',
    },

    searchInfo: {
      marginTop: 12,
      marginBottom: 4,
      paddingHorizontal: 5,
    },

    searchInfoText: {
      fontSize: isTablet ? 14 : 13,
      color: '#666',
      fontWeight: '500',
    },

    /* No Search Results */
    noSearchResults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: isTablet ? 60 : 40,
      paddingHorizontal: 20,
    },

    noSearchResultsText: {
      fontSize: isTablet ? 22 : 20,
      fontWeight: '600',
      color: '#333',
      marginTop: 20,
      marginBottom: 8,
    },

    noSearchResultsSubText: {
      fontSize: isTablet ? 16 : 15,
      color: '#999',
      marginBottom: 25,
      textAlign: 'center',
    },

    clearSearchButton: {
      backgroundColor: '#93210A',
      paddingHorizontal: isTablet ? 30 : 25,
      paddingVertical: isTablet ? 14 : 12,
      borderRadius: 25,
      shadowColor: '#93210A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },

    clearSearchButtonText: {
      color: '#fff',
      fontSize: isTablet ? 18 : 16,
      fontWeight: '600',
    },

    backButtonText: {
      color: "#fff",
      fontSize: isTablet ? 18 : 16,
      fontWeight: "600",
    },

    /* Search Result Header */
    searchResultHeader: {
      paddingHorizontal: 5,
      paddingBottom: 15,
    },

    searchResultHeaderText: {
      fontSize: isTablet ? 15 : 14,
      color: '#666',
      fontWeight: '500',
    },

    /* List Content */
    listContent: {
      paddingTop: 20,
      paddingBottom: 30,
      paddingHorizontal: isTablet ? 15 : 12,
    },

    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: 15,
    },

    /* Event Cards - Grid Layout */
    eventCard: {
      width: numColumns === 3 
        ? isTablet ? '32%' : '48%' 
        : isTablet ? '48%' : '48%',
      borderRadius: 12,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#7c0000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      backgroundColor: '#fff',
    },

    gradientCard: {
      padding: isTablet ? 12 : 10,
    },

    eventImage: {
      width: '100%',
      height: isTablet ? 130 : 110,
      borderRadius: 8,
      marginBottom: 10,
    },

    cardContent: {
      flex: 1,
    },

    eventTitle: {
      fontSize: isTablet ? 15 : 13,
      fontWeight: "bold",
      color: "#222",
      marginBottom: 8,
      textAlign: 'left',
      lineHeight: isTablet ? 20 : 18,
    },

    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(147, 33, 10, 0.1)',
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 6,
      alignSelf: 'flex-start',
      marginBottom: 6,
    },

    eventDate: {
      fontSize: isTablet ? 12 : 10,
      color: "#93210A",
      fontWeight: "600",
      marginLeft: 4,
    },

    dayBadge: {
      backgroundColor: '#93210A',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },

    dayBadgeText: {
      color: '#fff',
      fontSize: isTablet ? 11 : 10,
      fontWeight: '600',
    },
  });