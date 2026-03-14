// src/components/News/NewsHistory/NewsMonth.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { fetchNews } from "../../../Controller/NewsController/NewsController";
import Loader from "../../../components/Alert/Loader";


// Month data
const MONTHS = [
  { id: 0, name: 'January' },
  { id: 1, name: 'February' },
  { id: 2, name: 'March' },
  { id: 3, name: 'April' },
  { id: 4, name: 'May' },
  { id: 5, name: 'June' },
  { id: 6, name: 'July' },
  { id: 7, name: 'August' },
  { id: 8, name: 'September' },
  { id: 9, name: 'October' },
  { id: 10, name: 'November' },
  { id: 11, name: 'December' },
];

export default function NewsMonth() {
  const navigation = useNavigation(); 
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedNews, setGroupedNews] = useState({});
  const [filteredGroupedNews, setFilteredGroupedNews] = useState({});
  
  // Year search state
  const [searchYear, setSearchYear] = useState('');
  const [noResults, setNoResults] = useState(false);
  
  // Month dropdown state
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredByMonth, setFilteredByMonth] = useState(null);
  
  const yearInputRef = useRef(null);

  useEffect(() => {
    loadNews();
  }, []);

  // Filter function - simple and direct
  const filterNews = () => {
    let filtered = { ...groupedNews };
    
    // Apply year filter
    if (searchYear.trim()) {
      const yearFiltered = {};
      let hasResults = false;

      Object.keys(groupedNews).forEach(key => {
        const monthData = groupedNews[key];
        const yearString = monthData.year.toString();
        if (yearString.startsWith(searchYear)) {
          yearFiltered[key] = monthData;
          hasResults = true;
        }
      });

      filtered = yearFiltered;
      setNoResults(!hasResults && searchYear.length > 0);
    } else {
      setNoResults(false);
    }
    
    // Apply month filter
    if (filteredByMonth) {
      const monthFiltered = {};
      Object.keys(filtered).forEach(key => {
        const monthData = filtered[key];
        if (monthData.monthId === filteredByMonth.id) {
          monthFiltered[key] = monthData;
        }
      });
      setFilteredGroupedNews(monthFiltered);
    } else {
      setFilteredGroupedNews(filtered);
    }
  };

  // Call filter whenever dependencies change
  useEffect(() => {
    filterNews();
  }, [searchYear, groupedNews, filteredByMonth]);

  const loadNews = async () => {
    try {
      const data = await fetchNews();
      // console.log("Loaded news:", data.length);
      
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });

      setNews(sortedData);
      groupNewsByMonth(sortedData);
    } catch (error) {
      console.error("Error loading news:", error);
      Alert.alert("Error", "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const groupNewsByMonth = (newsData) => {
    const grouped = {};
    
    newsData.forEach(item => {
      if (item.date) {
        const date = new Date(item.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = {
            monthName: monthYear,
            monthId: date.getMonth(),
            year: date.getFullYear(),
            news: []
          };
        }
        grouped[monthKey].news.push(item);
      }
    });

    // Sort months chronologically
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach(key => {
        sortedGrouped[key] = grouped[key];
      });

    setGroupedNews(sortedGrouped);
    setFilteredGroupedNews(sortedGrouped);
  };

  const handleYearSearch = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setSearchYear(numericText);
  };

  const clearYearSearch = () => {
    setSearchYear('');
    setNoResults(false);
  };

  const handleMonthPress = (monthData) => {
    if (navigation && navigation.navigate) {
      try {
        navigation.navigate("NewsMonthHistory", { 
          monthName: monthData.monthName,
          news: monthData.news 
        });
      } catch (error) {
        console.error("Navigation error:", error);
        Alert.alert("Error", "Failed to navigate");
      }
    }
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setFilteredByMonth(month);
    setShowMonthDropdown(false);
  };

  const clearMonthFilter = () => {
    setSelectedMonth(null);
    setFilteredByMonth(null);
  };

  const renderMonthDropdownItem = ({ item }) => {
    // Check if this month has any news
    const hasNews = Object.values(groupedNews).some(
      monthData => monthData.monthId === item.id
    );
    
    return (
      <TouchableOpacity
        style={[
          styles.dropdownItem,
          !hasNews && styles.dropdownItemDisabled
        ]}
        onPress={() => hasNews && handleMonthSelect(item)}
        activeOpacity={hasNews ? 0.7 : 1}
        disabled={!hasNews}
      >
        <View style={styles.dropdownItemContent}>
          <Ionicons 
            name="calendar-outline" 
            size={18} 
            color={hasNews ? "#93210A" : "#ccc"} 
            style={styles.dropdownItemIcon}
          />
          <Text style={[
            styles.dropdownItemText,
            !hasNews && styles.dropdownItemTextDisabled
          ]}>
            {item.name}
          </Text>
          {hasNews && (
            <Ionicons name="chevron-forward" size={16} color="#93210A" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Loader/>;
  }

  // Convert grouped news to array for FlatList
  const monthData = Object.entries(filteredGroupedNews).map(([key, value]) => ({
    key,
    ...value
  }));

  // Default message when no data
  if (monthData.length === 0 && !loading && !searchYear && !filteredByMonth) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={isTablet ? 32 : 28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News History</Text>
          <View style={styles.rightPlaceholder} />
        </View>
        <View style={styles.noResultsContainer}>
          <Ionicons name="newspaper-outline" size={isTablet ? 80 : 60} color="#ccc" />
          <Text style={styles.noResultsText}>No news available</Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>News History</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          {/* Year Search Box */}
          <View style={[styles.searchBox]}>
            <Ionicons name="calendar-number" size={18} color="#666" />
            <TextInput
              ref={yearInputRef}
              style={styles.searchInput}
              placeholder="Year"
              placeholderTextColor="#999"
              value={searchYear}
              onChangeText={handleYearSearch}
              keyboardType="numeric"
              maxLength={4}
            />
            {searchYear.length > 0 && (
              <TouchableOpacity onPress={clearYearSearch}>
                <Ionicons name="close-circle" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Month Dropdown Button */}
          <View style={styles.monthDropdownContainer}>
            <TouchableOpacity
              style={[styles.searchBox]}
              onPress={() => setShowMonthDropdown(!showMonthDropdown)}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar" size={18} color="#666" />
              <Text style={[
                styles.dropdownButtonText,
                selectedMonth && styles.dropdownButtonTextSelected
              ]}>
                {selectedMonth ? selectedMonth.name : "Month"}
              </Text>
              <Ionicons 
                name={showMonthDropdown ? "chevron-up" : "chevron-down"} 
                size={18} 
                color="#666" 
              />
            </TouchableOpacity>

            {/* Month Dropdown */}
            {showMonthDropdown && (
              <View style={styles.dropdownWrapper}>
                <FlatList
                  data={MONTHS}
                  renderItem={renderMonthDropdownItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={true}
                  style={styles.dropdownList}
                  contentContainerStyle={styles.dropdownContent}
                  initialNumToRender={4}
                  maxToRenderPerBatch={4}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>
        </View>

        {/* Active Filters */}
        {(selectedMonth || searchYear) && (
          <View style={styles.activeFilters}>
            <View style={styles.filterChips}>
              {selectedMonth && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterChipText}>{selectedMonth.name}</Text>
                  <TouchableOpacity onPress={clearMonthFilter}>
                    <Ionicons name="close-circle" size={16} color="#93210A" />
                  </TouchableOpacity>
                </View>
              )}
              {searchYear.length > 0 && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Year: {searchYear}</Text>
                  <TouchableOpacity onPress={clearYearSearch}>
                    <Ionicons name="close-circle" size={16} color="#93210A" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Content */}
      {noResults ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="calendar-outline" size={isTablet ? 80 : 60} color="#ccc" />
          <Text style={styles.noResultsText}>
            No news found for year {searchYear}
          </Text>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearYearSearch}
          >
            <Text style={styles.clearButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={monthData}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.monthCard}
              onPress={() => handleMonthPress(item)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#FFF5E1', '#ffd391']}
                style={styles.gradientCard}
              >
                <View style={styles.monthIconContainer}>
                  <Ionicons 
                    name="calendar" 
                    size={isTablet ? 50 : 40} 
                    color="#93210A" 
                  />
                </View>
                
                <View style={styles.monthInfo}>
                  <Text style={styles.monthName}>{item.monthName}</Text>
                  <View style={styles.newsCountContainer}>
                    <Text style={styles.newsCount}>
                      {item.news.length} {item.news.length === 1 ? 'News' : 'News'}
                    </Text>
                  </View>
                </View>
                
                <Ionicons name="chevron-forward" size={24} color="#93210A" />
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const getStyles = (isTablet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
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
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      zIndex: 10,
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
    },
    rightPlaceholder: {
      width: isTablet ? 50 : 40,
      height: isTablet ? 50 : 40,
    },

    /* Search Section */
    searchSection: {
      paddingHorizontal: isTablet ? 20 : 16,
      paddingTop: isTablet ? 20 : 15,
      paddingBottom: isTablet ? 10 : 8,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      zIndex: 1000,
    },
    searchRow: {
      flexDirection: 'row',
      gap: isTablet ? 12 : 10,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: isTablet ? 12 : 10,
    },
    searchInput: {
      flex: 1,
      fontSize: isTablet ? 16 : 14,
      color: '#333',
      paddingHorizontal: 8,
      paddingVertical: 0,
    },
    monthDropdownContainer: {
      flex: 1,
      position: 'relative',
      zIndex: 2000,
    },
    dropdownButtonText: {
      flex: 1,
      fontSize: isTablet ? 16 : 14,
      color: '#999',
      paddingHorizontal: 8,
    },
    dropdownButtonTextSelected: {
      color: '#333',
    },

    /* Active Filters */
    activeFilters: {
      marginTop: 12,
    },
    filterChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      gap: 6,
    },
    filterChipText: {
      fontSize: isTablet ? 13 : 12,
      color: '#333',
    },

    /* Results Count */
    resultsCount: {
      paddingHorizontal: isTablet ? 20 : 16,
      paddingVertical: 10,
      backgroundColor: '#f9f9f9',
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    resultsCountText: {
      fontSize: isTablet ? 14 : 13,
      color: '#666',
      fontWeight: '500',
    },

    /* Dropdown Wrapper */
    dropdownWrapper: {
      position: 'absolute',
      top: isTablet ? 52 : 45,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      maxHeight: isTablet ? 300 : 280,
      zIndex: 3000,
    },
    dropdownList: {
      maxHeight: isTablet ? 300 : 280,
    },
    dropdownContent: {
      paddingVertical: 4,
    },
    dropdownItem: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    dropdownItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdownItemIcon: {
      marginRight: 10,
    },
    dropdownItemText: {
      flex: 1,
      fontSize: isTablet ? 16 : 14,
      color: '#333',
    },
    dropdownItemTextDisabled: {
      color: '#ccc',
    },
    dropdownItemDisabled: {
      opacity: 0.7,
    },

    /* List Content */
    listContent: {
      paddingHorizontal: isTablet ? 20 : 16,
      paddingTop: isTablet ? 10 : 8,
      paddingBottom: isTablet ? 30 : 25,
    },

    /* No Results Styles */
    noResultsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: isTablet ? 60 : 40,
    },
    noResultsText: {
      fontSize: isTablet ? 18 : 16,
      color: '#666',
      marginTop: 15,
      marginBottom: 20,
      textAlign: 'center',
    },
    clearButton: {
      backgroundColor: '#93210A',
      paddingHorizontal: isTablet ? 25 : 20,
      paddingVertical: isTablet ? 12 : 10,
      borderRadius: 8,
    },
    clearButtonText: {
      color: '#fff',
      fontSize: isTablet ? 16 : 14,
      fontWeight: '600',
    },

    /* Month Card Styles */
    monthCard: {
      marginBottom: isTablet ? 16 : 12,
      borderRadius: 12,
      overflow: "hidden",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    gradientCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: isTablet ? 16 : 14,
    },
    monthIconContainer: {
      width: isTablet ? 55 : 45,
      height: isTablet ? 55 : 45,
      borderRadius: 28,
      backgroundColor: 'rgba(147,33,10,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isTablet ? 15 : 12,
    },
    monthInfo: {
      flex: 1,
    },
    monthName: {
      fontSize: isTablet ? 18 : 16,
      fontWeight: "600",
      color: "#333",
      marginBottom: 4,
    },
    newsCountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    newsCount: {
      fontSize: isTablet ? 14 : 13,
      color: "#93210A",
      fontWeight: "500",
    },
  });