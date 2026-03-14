// src/screens/NewsMonthHistory.js
import React, { useState, useEffect } from "react";
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

export default function NewsMonthHistory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { monthName, news } = route.params || {};

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  
  // State for search
  const [searchText, setSearchText] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  
  // Calculate number of columns based on screen width
  const numColumns = isTablet ? 2 : 1;
  const styles = getStyles(isTablet, numColumns);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";  
    try {
      const date = new Date(dateString); 
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Filter function
  const filterNews = () => {
    if (!news) return;
    
    if (!searchText.trim()) {
      setFilteredNews(news);
      return;
    }
    
    // Check if searchText is a number (day search)
    const searchDayNum = parseInt(searchText, 10);
    if (!isNaN(searchDayNum)) {
      // Search by day
      const filtered = news.filter(item => {
        if (item.date) {
          const date = new Date(item.date);
          const day = date.getDate();
          return day === searchDayNum;
        }
        return false;
      });
      setFilteredNews(filtered);
    } else {
      // Search by text (if not a number)
      const searchLower = searchText.toLowerCase().trim();
      const filtered = news.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(searchLower) || false;
        const typeMatch = item.type?.toLowerCase().includes(searchLower) || false;
        return titleMatch || typeMatch;
      });
      setFilteredNews(filtered);
    }
  };

  // Call filter whenever searchText or news changes
  useEffect(() => {
    filterNews();
  }, [searchText, news]);

  const clearSearch = () => {
    setSearchText('');
  };

  if (!news || news.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Ionicons name="newspaper-outline" size={isTablet ? 80 : 60} color="#ccc" />
        <Text style={styles.noNewsText}>No news found for {monthName}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => navigation.navigate("Newspage2", { news: item })}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#FFF5E1', '#ffd391']}
        style={styles.gradientCard}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.newsImage} 
          resizeMode="cover"
        />
        
        <View style={styles.cardContent}>
          {/* Only show type/category in red - no title */}
          <Text style={styles.newsType} numberOfLines={2}>
            {item.type || "News"}
          </Text>
          
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#93210A" />
            <Text style={styles.newsDate} numberOfLines={1}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Get unique days that have news
  const availableDays = React.useMemo(() => {
    const days = new Set();
    news.forEach(item => {
      if (item.date) {
        const date = new Date(item.date);
        const day = date.getDate();
        days.add(day);
      }
    });
    return Array.from(days).sort((a, b) => a - b);
  }, [news]);

  const handleDayPress = (day) => {
    setSearchText(day.toString());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={isTablet ? 32 : 28} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {monthName || "News History"}
        </Text>
        
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, searchText.length > 0 && styles.searchBoxActive]}>
          <Ionicons name="calendar-number" size={20} color={searchText.length > 0 ? "#93210A" : "#999"} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by day (e.g., 15)"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            keyboardType="numeric"
            maxLength={2}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#93210A" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Quick day filters */}
        {availableDays.length > 0 && !searchText && (
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
      </View>

      {/* No search results */}
      {searchText.length > 0 && filteredNews.length === 0 ? (
        <View style={styles.noSearchResults}>
          <Ionicons name="search-outline" size={isTablet ? 70 : 50} color="#ccc" />
          <Text style={styles.noSearchResultsText}>No news found</Text>
          <Text style={styles.noSearchResultsSubText}>
            No news found for "{searchText}" in {monthName}
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
          data={filteredNews}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            searchText.length > 0 && filteredNews.length > 0 ? (
              <View style={styles.searchResultHeader}>
                <Text style={styles.searchResultHeaderText}>
                  Showing {filteredNews.length} of {news.length} news
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

    noNewsText: {
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

    backButtonText: {
      color: "#fff",
      fontSize: isTablet ? 18 : 16,
      fontWeight: "600",
    },

    /* Search Bar Styles */
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
      marginTop: 8,
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
      padding: isTablet ? 20 : 16,
    },

    /* News Cards */
    newsCard: {
      marginBottom: isTablet ? 16 : 12,
      borderRadius: 12,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#93210A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    gradientCard: {
      flexDirection: "row",
      padding: isTablet ? 16 : 12,
    },

    newsImage: {
      width: isTablet ? 120 : 100,
      height: isTablet ? 120 : 100,
      borderRadius: 8,
      marginRight: 15,
    },

    cardContent: {
      flex: 1,
      justifyContent: 'center',
    },

    newsType: {
      fontSize: isTablet ? 20 : 14,
      color: "#93210A",
      fontWeight: "bold",
      marginBottom: 8,
      textTransform: 'uppercase',
    },

    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(147, 33, 10, 0.1)',
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },

    newsDate: {
      fontSize: isTablet ? 13 : 12,
      color: "#93210A",
      fontWeight: "500",
      marginLeft: 4,
    },
  });