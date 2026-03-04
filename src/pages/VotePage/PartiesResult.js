import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { 
  getDistricts, 
  getAssembliesByDistrict 
} from '../../api/api.js';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from '../../components/Alert/Loader.js';

const { width } = Dimensions.get('window');

const SearchIcon = () => <Ionicons name="search" size={20} color="#666" />;
const ChevronDown = () => <Ionicons name="chevron-down" size={20} color="#666" />;

export default function PartiesResult({ navigation }) {
  const [districts, setDistricts] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [districtModal, setDistrictModal] = useState(false);
  const [assemblyModal, setAssemblyModal] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [assemblySearch, setAssemblySearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [allVotes, setAllVotes] = useState([]);
  const [parties, setParties] = useState([]);
  const [assemblyWins, setAssemblyWins] = useState({});
  const [totalSeats, setTotalSeats] = useState(0);

  const BASE_URL = "https://hdrss-backend.onrender.com/api";

  // Alliance color mapping based on party names
  const allianceColors = {
    'DMK': { color: '#E53935', gradient: ['#FF5252', '#E53935'], icon: '☀️' },
    'AIADMK': { color: '#43A047', gradient: ['#66BB6A', '#43A047'], icon: '🍃' },
    'BJP': { color: '#FF9800', gradient: ['#FFB74D', '#FF9800'], icon: '🌸' },
    'TVK': { color: '#2196F3', gradient: ['#64B5F6', '#2196F3'], icon: '🐘' },
    'CONGRESS': { color: '#9C27B0', gradient: ['#BA68C8', '#9C27B0'], icon: '🤚' },
    'Others': { color: '#757575', gradient: ['#9E9E9E', '#757575'], icon: '📊' }
  };

  // Party symbol mapping
  const partySymbols = {
    'DMK': '☀️',
    'AIADMK': '🍃',
    'BJP': '🌸',
    'CONGRESS': '🤚',
    'COMMUNIST': '☭',
    'PMK': '🐔',
    'TVK': '🐘',
    'DEFAULT': '📊'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const districtsRes = await getDistricts();
      setDistricts(districtsRes.data.data || []); 

      await fetchAllVotes();
      
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVotes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/votes`);
      if (response.data.success) {
        const votesData = response.data.data || [];
        setAllVotes(votesData);
        calculateResults(votesData);
        calculateAssemblyWins(votesData);
        
        // Calculate total seats based on unique assemblies
        const uniqueAssemblies = new Set(votesData.map(vote => vote.assemblyId));
        setTotalSeats(uniqueAssemblies.size);

        const uniqueParties = {};
        votesData.forEach(vote => {
          if (vote.partyId && !uniqueParties[vote.partyId]) {
            uniqueParties[vote.partyId] = {
              id: vote.partyId,
              name: vote.partyName || 'Unknown',
              image: vote.partyImage || '',
              symbol: getPartySymbol(vote.partyName)
            };
          }
        });
        setParties(Object.values(uniqueParties));
      }
    } catch (error) {
      console.error('Error fetching all votes:', error);
      Alert.alert('Error', 'Failed to load votes data.');
    }
  };

  const fetchVotesByDistrict = async (districtId, districtName) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/votes/votes/filter?districtId=${districtId}`);
      
      if (response.data.success) {
        const votesData = response.data.data || [];
        calculateResults(votesData);
        calculateAssemblyWins(votesData);
        
        const uniqueAssemblies = new Set(votesData.map(vote => vote.assemblyId));
        setTotalSeats(uniqueAssemblies.size);

        if (districtName) {
          const assembliesRes = await getAssembliesByDistrict(districtName);
          setAssemblies(assembliesRes.data.constituencies || []);
        }
      } else {
        Alert.alert('Info', 'No votes found for this district.');
        calculateResults([]);
        setAssemblyWins({});
        setTotalSeats(0);
      }
    } catch (error) {
      console.error('Error fetching district votes:', error);
      Alert.alert('Error', `Failed to load votes. ${error.message}`);
      calculateResults([]);
      setAssemblyWins({});
      setTotalSeats(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchVotesByAssembly = async (assemblyId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/votes/votes/filter?assemblyId=${assemblyId}`);
      
      if (response.data.success) {
        const votesData = response.data.data || [];
        calculateResults(votesData);
        calculateAssemblyWins(votesData);
        setTotalSeats(1); // Single assembly
      } else {
        Alert.alert('Info', 'No votes found for this assembly.');
        calculateResults([]);
        setAssemblyWins({});
        setTotalSeats(0);
      }
    } catch (error) {
      console.error('Error fetching assembly votes:', error);
      Alert.alert('Error', 'Failed to load votes.');
      calculateResults([]);
      setAssemblyWins({});
      setTotalSeats(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateResults = (votesData) => {
    
    if (!votesData || votesData.length === 0) {
      setResults([]);
      setTotalVotes(0);
      return;
    }

    const partyVotes = {};
    let total = 0;

    votesData.forEach(vote => {
      total++;
      const partyId = vote.partyId ? vote.partyId.toString() : 'unknown';
      const partyName = vote.partyName || 'Unknown Party';
      const partyImage = vote.partyImage || '';
      const symbol = getPartySymbol(partyName);
      const alliance = getAllianceFromParty(partyName);
      
      if (!partyVotes[partyId]) {
        partyVotes[partyId] = {
          partyId: partyId,
          votes: 0,
          partyName: partyName,
          partyImage: partyImage,
          symbol: symbol,
          alliance: alliance,
          color: getAllianceColor(alliance).color,
          percentage: 0
        };
      }
      partyVotes[partyId].votes++;
    });

    const resultsArray = Object.values(partyVotes).map(party => {
      const percentage = total > 0 ? ((party.votes / total) * 100).toFixed(1) : 0;
      return {
        ...party,
        percentage: parseFloat(percentage)
      };
    }).sort((a, b) => b.percentage - a.percentage);

    setResults(resultsArray);
    setTotalVotes(total);
  };

  const calculateAssemblyWins = (votesData) => {
    if (!votesData || votesData.length === 0) {
      setAssemblyWins({});
      return;
    }

    const assemblyResults = {};
    
    votesData.forEach(vote => {
      const assemblyId = vote.assemblyId;
      const assemblyName = vote.assemblyName || `Assembly ${assemblyId}`;
      const partyId = vote.partyId.toString();
      const partyName = vote.partyName || 'Unknown';
      
      if (!assemblyResults[assemblyId]) {
        assemblyResults[assemblyId] = {
          name: assemblyName,
          parties: {}
        };
      }
      
      if (!assemblyResults[assemblyId].parties[partyId]) {
        assemblyResults[assemblyId].parties[partyId] = {
          votes: 0,
          name: partyName
        };
      }
      
      assemblyResults[assemblyId].parties[partyId].votes++;
    });

    const partyWins = {};
    
    Object.keys(assemblyResults).forEach(assemblyId => {
      const assembly = assemblyResults[assemblyId];
      let winningPartyId = null;
      let maxVotes = 0;
      
      Object.keys(assembly.parties).forEach(partyId => {
        if (assembly.parties[partyId].votes > maxVotes) {
          maxVotes = assembly.parties[partyId].votes;
          winningPartyId = partyId;
        }
      });
      
      if (winningPartyId) {
        if (!partyWins[winningPartyId]) {
          partyWins[winningPartyId] = 0;
        }
        partyWins[winningPartyId]++;
      }
    });

    setAssemblyWins(partyWins);
  };

  const getPartySymbol = (partyName) => {
    if (!partyName) return partySymbols.DEFAULT;
    
    const name = partyName.toLowerCase();
    if (name.includes('dmk')) return partySymbols.DMK;
    if (name.includes('aiadmk')) return partySymbols.AIADMK;
    if (name.includes('bjp')) return partySymbols.BJP;
    if (name.includes('congress')) return partySymbols.CONGRESS;
    if (name.includes('communist')) return partySymbols.COMMUNIST;
    if (name.includes('pmk')) return partySymbols.PMK;
    if (name.includes('tvk')) return partySymbols.TVK;
    return partySymbols.DEFAULT;
  };

  const getAllianceFromParty = (partyName) => {
    if (!partyName) return 'Others';
    
    const name = partyName.toLowerCase();
    
    // Major parties get their own alliance
    if (name.includes('dmk') && !name.includes('aiadmk')) return 'DMK';
    if (name.includes('aiadmk')) return 'AIADMK';
    if (name.includes('bjp') || name.includes('bharatiya janata')) return 'BJP';
    if (name.includes('tvk') || name.includes('tamil')) return 'TVK';
    if (name.includes('congress')) return 'CONGRESS';
    
    // All other parties go to "Others"
    return 'Others';
  };

  const getAllianceColor = (alliance) => {
    return allianceColors[alliance] || allianceColors.Others;
  };

  const selectDistrict = async (district) => {
    setSelectedDistrict(district);
    setSelectedAssembly(null);
    setDistrictModal(false);
    setDistrictSearch('');
    fetchVotesByDistrict(district.id, district.name);
  };

  const selectAssembly = async (assembly) => {
    setSelectedAssembly(assembly);
    setAssemblyModal(false);
    setAssemblySearch('');
    fetchVotesByAssembly(assembly.id);
  };

  const clearFilters = () => {
    setSelectedDistrict(null);
    setSelectedAssembly(null);
    setAssemblies([]);
    calculateResults(allVotes);
    calculateAssemblyWins(allVotes);
    
    // Reset total seats to all assemblies
    const uniqueAssemblies = new Set(allVotes.map(vote => vote.assemblyId));
    setTotalSeats(uniqueAssemblies.size);
  };

  const getResultTitle = () => {
    if (selectedAssembly) {
      return `${selectedAssembly.en} Results`;
    } else if (selectedDistrict) {
      return `${selectedDistrict.name} District`;
    } else {
      return 'தமிழ்நாடு தேர்தல் முடிவுகள்';
    }
  };

  const getResultSubtitle = () => {
    if (selectedAssembly) {
      return 'சட்டமன்றத் தேர்தல் முடிவுகள்';
    } else if (selectedDistrict) {
      return 'மாவட்ட தேர்தல் முடிவுகள்';
    } else {
      return 'சட்டமன்றத் தேர்தல் முடிவுகள்';
    }
  };

  const calculateSeatPercentage = (seats) => {
    return totalSeats > 0 ? ((seats / totalSeats) * 100).toFixed(1) : '0';
  };

  const calculateVotePercentage = (votes) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0';
  };

  const StatCard = ({ label, value, percentage, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statPercentage}>{percentage}%</Text>
    </View>
  );

  const PartyCard = ({ party, index }) => (
    <TouchableOpacity 
      style={[styles.partyCard, { borderLeftColor: party.color }]}
      activeOpacity={0.7}
    >
      <View style={styles.partyHeader}>
        <View style={[styles.partySymbolContainer, { backgroundColor: party.color }]}>
          <Text style={styles.partySymbol}>{party.symbol}</Text>
        </View>
        <View style={styles.partyInfo}>
          <Text style={styles.partyName} numberOfLines={2}>
            {party.partyName}
          </Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.partyStats}>
        <View style={styles.partyStat}>
          <Text style={styles.partyStatLabel}>Seats</Text>
          <Text style={styles.partyStatValue}>
            {assemblyWins[party.partyId] || 0}
          </Text>
          <View style={[styles.seatBar, { 
            width: `${calculateSeatPercentage(assemblyWins[party.partyId] || 0)}%`, 
            backgroundColor: party.color 
          }]} />
        </View>
        <View style={styles.partyStat}>
          <Text style={styles.partyStatLabel}>Votes</Text>
          <Text style={styles.partyStatValue}>
            {party.votes > 1000000 ? `${(party.votes / 1000000).toFixed(1)}M` : party.votes.toLocaleString()}
          </Text>
          <View style={[styles.voteBar, { 
            width: `${calculateVotePercentage(party.votes)}%`, 
            backgroundColor: party.color 
          }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ icon, label, value, onPress, disabled }) => (
    <TouchableOpacity
      style={[styles.filterButton, disabled && styles.filterButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.filterButtonContent}>
        <Ionicons name={icon} size={20} color={disabled ? "#aaa" : "#666"} />
        <View style={styles.filterButtonTexts}>
          <Text style={[styles.filterButtonLabel, disabled && styles.filterButtonLabelDisabled]}>
            {label}
          </Text>
          <Text style={[styles.filterButtonValue, disabled && styles.filterButtonValueDisabled]}>
            {value || 'Select...'}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-down" size={20} color={disabled ? "#aaa" : "#666"} />
    </TouchableOpacity>
  );

  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredAssemblies = assemblies.filter(
    (a) =>
      a.en.toLowerCase().includes(assemblySearch.toLowerCase()) ||
      (a.ta && a.ta.includes(assemblySearch))
  );

  if (loading && results.length === 0) {
    return (
      <Loader/>
    );
  }

  // Group parties by alliance
  const groupedParties = results.reduce((acc, party) => {
    const alliance = party.alliance;
    if (!acc[alliance]) {
      acc[alliance] = {
        name: alliance,
        color: party.color,
        icon: getAllianceColor(alliance).icon,
        parties: [],
        totalSeats: 0,
        totalVotes: 0
      };
    }
    acc[alliance].parties.push(party);
    acc[alliance].totalSeats += assemblyWins[party.partyId] || 0;
    acc[alliance].totalVotes += party.votes;
    return acc;
  }, {});

  const alliances = Object.values(groupedParties).sort((a, b) => b.totalSeats - a.totalSeats);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.heroTitleContainer}>
              <Text style={styles.heroTitle}>{getResultTitle()}</Text>
              <Text style={styles.heroSubtitle}>{getResultSubtitle()}</Text>
            </View>
            <View style={styles.headerRight} />
          </View>
          
          <View style={styles.heroStats}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{totalSeats}</Text>
              <Text style={styles.mainStatLabel}>Total Seats</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>
                {totalVotes > 1000000 ? `${(totalVotes / 1000000).toFixed(1)}M` : totalVotes.toLocaleString()}
              </Text>
              <Text style={styles.mainStatLabel}>Votes Cast</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{results.length}</Text>
              <Text style={styles.mainStatLabel}>Parties</Text>
            </View>
          </View>

          {/* Filter Section */}
          <View style={styles.filterSection}>
            <FilterButton
              icon="location"
              label="District"
              value={selectedDistrict?.name}
              onPress={() => setDistrictModal(true)}
            />
            <FilterButton
              icon="business"
              label="Assembly"
              value={selectedAssembly?.en}
              onPress={() => setAssemblyModal(true)}
              disabled={!selectedDistrict}
            />
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={clearFilters}
            >
              <Ionicons name="close-circle" size={20} color="#fff" />
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        {results.length > 0 && (
          <View style={styles.quickStats}>
            <StatCard
              label="Leading Party"
              value={results[0]?.partyName?.split(' ')[0] || 'None'}
              percentage={calculateSeatPercentage(assemblyWins[results[0]?.partyId] || 0)}
              color={results[0]?.color || '#E53935'}
            />
            <StatCard
              label="Winning Margin"
              value={assemblyWins[results[0]?.partyId] || 0}
              percentage={calculateSeatPercentage(assemblyWins[results[0]?.partyId] || 0)}
              color="#FF9800"
            />
            <StatCard
              label="Vote Share"
              value={`${results[0]?.percentage || 0}%`}
              percentage={results[0]?.percentage || 0}
              color="#43A047"
            />
          </View>
        )}

        {/* Seat Distribution Chart */}
        {alliances.length > 0 && (
          <View style={styles.seatDistribution}>
            <Text style={styles.sectionTitle}>Seat Distribution</Text>
            <View style={styles.distributionBar}>
              {alliances.map((alliance, index) => (
                <View
                  key={index}
                  style={[
                    styles.distributionSegment,
                    {
                      width: `${calculateSeatPercentage(alliance.totalSeats)}%`,
                      backgroundColor: alliance.color,
                    },
                  ]}
                >
                  <Text style={styles.segmentText}>
                    {calculateSeatPercentage(alliance.totalSeats)}%
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.legendContainer}>
              {alliances.map((alliance, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: alliance.color }]} />
                  <Text style={styles.legendText}>
                    {alliance.name} - {alliance.totalSeats} seats
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Alliance Results */}
        {alliances.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Alliance & Party Results</Text>
            {alliances.map((alliance, index) => (
              <View key={index} style={styles.allianceSection}>
                <View style={[styles.allianceHeader, { backgroundColor: alliance.color }]}>
                  <View style={styles.allianceTitleRow}>
                    <Text style={styles.allianceIcon}>{alliance.icon}</Text>
                    <Text style={styles.allianceName}>{alliance.name}</Text>
                    <View style={styles.allianceBadge}>
                      <Text style={styles.allianceBadgeText}>{alliance.totalSeats} seats</Text>
                    </View>
                  </View>
                  <Text style={styles.alliancePercentage}>
                    {calculateSeatPercentage(alliance.totalSeats)}% of total seats
                  </Text>
                </View>
                
                <View style={styles.partiesContainer}>
                  {alliance.parties.map((party, idx) => (
                    <PartyCard 
                      key={idx} 
                      party={party} 
                      index={results.findIndex(p => p.partyId === party.partyId)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>📊</Text>
            <Text style={styles.noResultsTitle}>No Results Found</Text>
            <Text style={styles.noResultsText}>
              {selectedDistrict || selectedAssembly 
                ? 'No votes have been cast for the selected filter.'
                : 'No votes have been cast yet.'}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchAllVotes}
            >
              <Text style={styles.refreshButtonText}>Refresh Results</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Key Highlights */}
        {results.length > 0 && (
          <View style={styles.highlightsSection}>
            <Text style={styles.sectionTitle}>Key Highlights</Text>
            <View style={styles.highlightsGrid}>
              <View style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>🏆</Text>
                <Text style={styles.highlightTitle}>Leading Party</Text>
                <Text style={styles.highlightText}>
                  {results[0]?.partyName} with {assemblyWins[results[0]?.partyId] || 0} seats
                </Text>
              </View>
              
              <View style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>📈</Text>
                <Text style={styles.highlightTitle}>Vote Share</Text>
                <Text style={styles.highlightText}>
                  {results[0]?.percentage}% of total votes
                </Text>
              </View>
              
              <View style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>🎯</Text>
                <Text style={styles.highlightTitle}>Total Participation</Text>
                <Text style={styles.highlightText}>
                  {totalVotes.toLocaleString()} votes cast
                </Text>
              </View>
              
              <View style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>🏛️</Text>
                <Text style={styles.highlightTitle}>Total Seats</Text>
                <Text style={styles.highlightText}>
                  {totalSeats} assembly seats
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Election Commission Dashboard</Text>
          <Text style={styles.footerSubtext}>Live Election Results Data</Text>
          <View style={styles.footerBadge}>
            <Text style={styles.footerBadgeText}>LIVE RESULTS</Text>
          </View>
        </View>
      </ScrollView>

      {/* District Modal */}
      <Modal visible={districtModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select District</Text>
              <TouchableOpacity onPress={() => {
                setDistrictModal(false);
                setDistrictSearch('');
              }}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <SearchIcon />
              <TextInput
                placeholder="Search districts..."
                value={districtSearch}
                onChangeText={setDistrictSearch}
                style={styles.searchInput}
                placeholderTextColor="#999"
              />
            </View>

            <FlatList
              data={filteredDistricts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    selectedDistrict?.id === item.id && styles.selectedItem
                  ]}
                  onPress={() => selectDistrict(item)}
                >
                  <Text style={styles.listItemText}>{item.name}</Text>
                  {selectedDistrict?.id === item.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>No districts found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Assembly Modal */}
      <Modal visible={assemblyModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Assembly ({selectedDistrict?.name})
              </Text>
              <TouchableOpacity onPress={() => {
                setAssemblyModal(false);
                setAssemblySearch('');
              }}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <SearchIcon />
              <TextInput
                placeholder="Search assemblies..."
                value={assemblySearch}
                onChangeText={setAssemblySearch}
                style={styles.searchInput}
                placeholderTextColor="#999"
              />
            </View>

            <FlatList
              data={filteredAssemblies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    selectedAssembly?.id === item.id && styles.selectedItem
                  ]}
                  onPress={() => selectAssembly(item)}
                >
                  <Text style={styles.listItemText}>{item.en}</Text>
                  {item.ta && <Text style={styles.listItemSubText}>{item.ta}</Text>}
                  {selectedAssembly?.id === item.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>No assemblies found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 12,
    fontWeight: '500',
  },
  heroSection: {
    backgroundColor: '#1A237E',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  heroTitleContainer: {
    paddingTop:8,
    flex: 1,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mainStat: {
    alignItems: 'center',
    flex: 1,
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 5,
  },
  mainStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButtonDisabled: {
    opacity: 0.5,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterButtonTexts: {
    marginLeft: 10,
    flex: 1,
  },
  filterButtonLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  filterButtonLabelDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  filterButtonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  filterButtonValueDisabled: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  clearFilterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 5,
  },
  statPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  seatDistribution: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  distributionBar: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 15,
  },
  distributionSegment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  legendContainer: {
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#34495E',
    fontWeight: '500',
  },
  allianceSection: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  allianceHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  allianceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  allianceIcon: {
    fontSize: 24,
  },
  allianceName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    marginLeft: 10,
  },
  allianceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  allianceBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  alliancePercentage: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  partiesContainer: {
    backgroundColor: 'white',
  },
  partyCard: {
    padding: 15,
    borderLeftWidth: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  partyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  partySymbolContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  partySymbol: {
    fontSize: 24,
  },
  partyInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 20,
    flex: 1,
    marginRight: 10,
  },
  rankBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  partyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partyStat: {
    flex: 1,
  },
  partyStatLabel: {
    fontSize: 11,
    color: '#95A5A6',
    marginBottom: 5,
  },
  partyStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 5,
  },
  seatBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  voteBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  noResults: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightsSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  highlightCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  highlightIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'center',
  },
  highlightText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    backgroundColor: '#2C3E50',
    padding: 25,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
  },
  footerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  footerBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
    letterSpacing: 1,
  },
  // Modal Styles (updated)
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  closeButton: {
    fontSize: 24,
    color: "#64748b",
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 8,
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 16,
    color: "#1e293b",
    flex: 1,
  },
  listItemSubText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  selectedItem: {
    backgroundColor: "#fef2f2",
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1A237E",
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#64748b',
    fontStyle: 'italic',
  },
});

