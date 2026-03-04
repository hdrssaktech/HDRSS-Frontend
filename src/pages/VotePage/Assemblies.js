
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Image
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useEffect, useState, useContext } from "react";
import {
  getDistricts,
  getAssembliesByDistrict,
  getParties
} from "../../api/api.js";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

// Simple text icons as components
const SearchIcon = () => <Text style={styles.iconText}>🔍</Text>;
const ChevronDown = () => <Text style={styles.iconText}>▼</Text>;
const MapPin = () => <Text style={styles.iconText}>📍</Text>;

export default function DistrictAssemblySelect({ navigation }) {
  const { userData } = useContext(AuthContext);
  const [districts, setDistricts] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [allParties, setAllParties] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [districtModal, setDistrictModal] = useState(false);
  const [assemblyModal, setAssemblyModal] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [assemblySearch, setAssemblySearch] = useState("");
  const [partySearch, setPartySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [showAllParties, setShowAllParties] = useState(false);
  const [isUnlimitedUser, setIsUnlimitedUser] = useState(false);
  const [unlimitedVoteCount, setUnlimitedVoteCount] = useState(0);
  const [previousVotes, setPreviousVotes] = useState([]);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Check if all three selections are made
    if (selectedDistrict && selectedAssembly && selectedParty && !hasUserVoted && !isUnlimitedUser) {
      // Show submit popup after 500ms delay
      const timer = setTimeout(() => {
        setShowSubmitPopup(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowSubmitPopup(false);
    }
  }, [selectedDistrict, selectedAssembly, selectedParty, hasUserVoted, isUnlimitedUser]);

  

  const loadInitialData = async () => {
    try {
      const [districtsRes, partiesRes] = await Promise.all([
        getDistricts(),
        getParties()
      ]);
      setDistricts(districtsRes.data.data);
      setAllParties(partiesRes.data.data);
      
      checkUserStatus();
    } catch (error) {
      console.error("Error loading initial data:", error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    }
  };

  const checkUserStatus = async () => {
    if (!userData?.id) {
      return;
    }
    
    const userId = userData.id.toString();
    
    const isUnlimited = userId === "3";
    
    setIsUnlimitedUser(isUnlimited);
    
    if (isUnlimited) {
      setHasUserVoted(false); 
      
      // Load previous votes for unlimited user
      loadUnlimitedUserVotes(userId);
    } else {
      // For regular users, check if they've already voted
      checkRegularUserVoteStatus(userId);
    }
  };

  const loadUnlimitedUserVotes = async (userId) => {
    try {
      const response = await axios.get("https://hdrss-backend.onrender.com/api/votes");
      if (response.data.success && response.data.data) {
        const userVotes = response.data.data.filter(vote => 
          vote.userId.toString() === userId
        );
        setUnlimitedVoteCount(userVotes.length);
        setPreviousVotes(userVotes);
      }
    } catch (error) {
      console.error("Error loading unlimited user votes:", error);
    }
  };

  const checkRegularUserVoteStatus = async (userId) => {
    try {
      const response = await axios.get(`https://hdrss-backend.onrender.com/api/votes/check-vote?userId=${userId}`);
    
      
      if (response.data.success) {
        if (response.data.unlimitedVote) {
          // User is unlimited user
          setIsUnlimitedUser(true);
          setHasUserVoted(false);
          loadUnlimitedUserVotes(userId);
        } else if (response.data.hasVoted) {
          // Regular user has voted
          setHasUserVoted(true);
          setVoteSubmitted(true);
          
          // Pre-fill selections if user wants to see their previous vote
          prefillPreviousVote(userId);
        } else {
          // Regular user hasn't voted
          setHasUserVoted(false);
        }
      }
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  const prefillPreviousVote = async (userId) => {
    try {
      // Get all votes and find this user's vote
      const response = await axios.get("https://hdrss-backend.onrender.com/api/votes");
      if (response.data.success && response.data.data) {
        const userVote = response.data.data.find(vote => 
          vote.userId.toString() === userId
        );
        
        if (userVote) {
          // Pre-fill district
          const district = districts.find(d => d.id.toString() === userVote.districtId.toString());
          if (district) {
            setSelectedDistrict(district);
            getAssembliesByDistrict(district.name).then((res) => {
              setAssemblies(res.data.constituencies);
              // Pre-fill assembly
              const assembly = res.data.constituencies.find(a => 
                a.id.toString() === userVote.assemblyId.toString()
              );
              if (assembly) setSelectedAssembly(assembly);
            });
          }
          
          // Pre-fill party
          const party = allParties.find(p => 
            p.id.toString() === userVote.partyId.toString()
          );
          if (party) setSelectedParty(party);
        }
      }
    } catch (error) {
      console.error("Error pre-filling previous vote:", error);
    }
  };

  const selectDistrict = (district) => {
    setSelectedDistrict(district);
    setSelectedAssembly(null);
    setSelectedParty(null);
    setDistrictModal(false);

    getAssembliesByDistrict(district.name).then((res) =>
      setAssemblies(res.data.constituencies)
    );
  };

  const selectAssembly = (assembly) => {
    setSelectedAssembly(assembly);
    setAssemblyModal(false);
  };

  const selectParty = (party) => {
    setSelectedParty(party);
  };

  const handleSubmitVote = async () => {
    const isUnlimited = userData.id.toString() === "3";
    
    if (!userData?.id) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    if (!selectedDistrict || !selectedAssembly || !selectedParty) {
      Alert.alert("Error", "Please select all fields");
      return;
    }

    // Prepare vote data
    const voteData = {
      userId: userData.id.toString(),
      districtId: selectedDistrict.id.toString(),
      districtName: selectedDistrict.name,
      assemblyId: selectedAssembly.id.toString(),
      assemblyName: selectedAssembly.en,
      partyId: selectedParty.id.toString(),
      partyName: selectedParty.name,
      partyImage: selectedParty.image || "default.jpg"
    };

    try {
      setLoading(true);
      const response = await axios.post("https://hdrss-backend.onrender.com/api/votes", voteData);

      
      if (response.data.success) {
        if (response.data.unlimitedVote) {
          // Unlimited user vote success
          const newVoteNumber = response.data.voteNumber;
          
          // Update vote count (for display)
          const newVoteCount = unlimitedVoteCount + 1;
          setUnlimitedVoteCount(newVoteCount);
          
          Alert.alert(
            "Vote Submitted Successfully", 
            `Vote #${newVoteNumber} submitted!\n\nUser ID: 3 has unlimited voting privileges.`,
            [
              { 
                text: "Submit Another Vote", 
                onPress: () => {
                  // Reset selections for next vote
                  setSelectedDistrict(null);
                  setSelectedAssembly(null);
                  setSelectedParty(null);
                  setShowSubmitPopup(false);
                }
              }
            ]
          );
        } else {
          // Regular user vote success
          setVoteSubmitted(true);
          setHasUserVoted(true);
          setShowSubmitPopup(false);
          
          Alert.alert(
            "Success", 
            "Your vote has been submitted successfully!",
            [
              { 
                text: "View Results", 
                onPress: () => navigation.navigate("VotePartiesResult")
              },
              {
                text: "OK",
                style: "cancel"
              }
            ]
          );
        }
      } else {
        Alert.alert("Error", response.data.message || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Submit vote error details:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400 && data.message === "User already voted") {
          Alert.alert("Already Voted", "You have already submitted your vote.");
          setHasUserVoted(true);
          setVoteSubmitted(true);
        } else {
          Alert.alert(
            "Error", 
            data.message || "Failed to submit vote. Please try again."
          );
        }
      } else {
        Alert.alert("Error", "Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const viewPreviousVotes = () => {
    if (previousVotes.length === 0) {
      Alert.alert("No Previous Votes", "You haven't submitted any votes yet.");
      return;
    }
    
    let message = `You have submitted ${previousVotes.length} vote(s):\n\n`;
    
    previousVotes.forEach((vote, index) => {
      message += `Vote #${index + 1};\n`;
      message += `District: ${vote.districtName}\n`;
      message += `Assembly: ${vote.assemblyName}\n`;
      message += `Party: ${vote.partyName}\n`;
      message += `Time: ${new Date(vote.createdAt).toLocaleString()}\n\n`;
    });
    
    Alert.alert("Your Previous Votes", message);
  };

  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredAssemblies = assemblies.filter(
    (a) =>
      a.en.toLowerCase().includes(assemblySearch.toLowerCase()) ||
      a.ta.includes(assemblySearch)
  );

  const filteredParties = (showAllParties ? allParties : allParties.slice(0, 8)).filter(
    (p) =>
      p.name.toLowerCase().includes(partySearch.toLowerCase()) ||
      p.abbr.toLowerCase().includes(partySearch.toLowerCase())
  );

  // Function to render parties in 2x2 grid
  const renderPartyGrid = () => {
    if (voteSubmitted && !isUnlimitedUser) {
      return (
        <View style={styles.voteSubmittedContainer}>
          <Text style={styles.voteSubmittedIcon}>✅</Text>
          <Text style={styles.voteSubmittedTitle}>Vote Submitted!</Text>
          <Text style={styles.voteSubmittedText}>
            Thank you for voting! Your vote has been recorded.
          </Text>
          
          <TouchableOpacity
            style={styles.viewResultsButton}
            onPress={() => navigation.navigate("VotePartiesResult")}
          >
            <Text style={styles.viewResultsButtonText}>View Live Results</Text>
          </TouchableOpacity>
          
          <View style={styles.selectedVoteDetails}>
            <Text style={styles.selectedVoteTitle}>Your Vote:</Text>
            {selectedDistrict && (
              <Text style={styles.selectedVoteText}>
                <Text style={styles.voteDetailLabel}>District:</Text> {selectedDistrict.name}
              </Text>
            )}
            {selectedAssembly && (
              <Text style={styles.selectedVoteText}>
                <Text style={styles.voteDetailLabel}>Assembly:</Text> {selectedAssembly.en}
              </Text>
            )}
            {selectedParty && (
              <View style={styles.selectedPartyContainer}>
                <View style={styles.selectedPartyLogo}>
                  {selectedParty.image ? (
                    <Image 
                      source={{ uri: selectedParty.image }}
                      style={styles.selectedPartyImage}
                    />
                  ) : (
                    <Text style={styles.selectedPartyLogoText}>
                      {selectedParty.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <View style={styles.selectedPartyInfo}>
                  <Text style={styles.selectedPartyName}>{selectedParty.name}</Text>
                  <Text style={styles.selectedPartyAbbr}>{selectedParty.abbr}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < filteredParties.length; i += 2) {
      const rowParties = filteredParties.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.partyRow}>
          {rowParties.map((party) => (
            <TouchableOpacity
              key={party.id}
              style={[
                styles.partyCard,
                selectedParty?.id === party.id && styles.partyCardSelected,
                hasUserVoted && !isUnlimitedUser && styles.disabledCard
              ]}
              onPress={() => (!hasUserVoted || isUnlimitedUser) && selectParty(party)}
              disabled={hasUserVoted && !isUnlimitedUser}
            >
              <View style={styles.partyLogo}>
                {party.image ? (
                  <Image 
                    source={{ uri: party.image}}
                    style={styles.partyImage}
                  />
                ) : (
                  <Text style={styles.partyLogoText}>
                    {party.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={styles.partyName} numberOfLines={2}>
                {party.name}
              </Text>
              <Text style={styles.partyAbbr} numberOfLines={1}>
                {party.abbr}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Add empty view if odd number of parties */}
          {rowParties.length < 2 && <View style={styles.partyCardEmpty} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isUnlimitedUser ? "Unlimited Voting" : "Vote Selection"}
        </Text>
        <TouchableOpacity
          style={styles.resultButtonHeader}
          onPress={() => navigation.navigate("VotePartiesResult")}
        >
          <Text style={styles.resultTextHeader}>Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current User Info */}
        {userData && (
          <View style={[styles.userInfo, isUnlimitedUser && styles.unlimitedUserInfo]}>
            <Text style={styles.userInfoText}>
              {isUnlimitedUser ? " (Unlimited Voting)" : hasUserVoted ? " (Already Voted)" : ""}
            </Text>
            {isUnlimitedUser && (
              <View style={styles.unlimitedStats}>
                <Text style={styles.unlimitedVoteCount}>
                  Votes submitted: {unlimitedVoteCount}
                </Text>
                {unlimitedVoteCount > 0 && (
                  <TouchableOpacity onPress={viewPreviousVotes} style={styles.viewVotesButton}>
                    <Text style={styles.viewVotesButtonText}>View Previous Votes</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {isUnlimitedUser && (
              <TouchableOpacity
                style={styles.resultButtonMain}
                onPress={() => navigation.navigate("VotePartiesResult")}
              >
                <Text style={styles.resultTextMain}>📊 View Live Election Results</Text>
                <Text style={styles.resultSubtext}>See party-wise vote counts</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View>
          <TouchableOpacity 
            style={styles.electionResultBtn} 
            onPress={() => navigation.navigate("Vote2023Result")}
          >
            <Text style={styles.electionResultBtnText}>2021 Election Results</Text>
          </TouchableOpacity>
        </View>

        {/* District Selection */}
        <TouchableOpacity
          style={[styles.selectionBox, hasUserVoted && !isUnlimitedUser && styles.disabled]}
          onPress={() => (!hasUserVoted || isUnlimitedUser) && setDistrictModal(true)}
          disabled={hasUserVoted && !isUnlimitedUser}
        >
          <View style={styles.selectionContent}>
            <MapPin />
            <View style={styles.selectionText}>
              <Text style={styles.selectionLabel}>District</Text>
              <Text style={selectedDistrict ? styles.selectedValue : styles.placeholder}>
                {selectedDistrict ? selectedDistrict.name : "Tap to select district"}
              </Text>
            </View>
            <ChevronDown />
          </View>
        </TouchableOpacity>

        {/* Assembly Selection */}
        <TouchableOpacity
          style={[styles.selectionBox, (!selectedDistrict || (hasUserVoted && !isUnlimitedUser)) && styles.disabled]}
          disabled={!selectedDistrict || (hasUserVoted && !isUnlimitedUser)}
          onPress={() => (!hasUserVoted || isUnlimitedUser) && setAssemblyModal(true)}
        >
          <View style={styles.selectionContent}>
            <MapPin />
            <View style={styles.selectionText}>
              <Text style={styles.selectionLabel}>Assembly Constituency</Text>
              <Text style={selectedAssembly ? styles.selectedValue : styles.placeholder}>
                {selectedAssembly ? `${selectedAssembly.en}` : "Select district first"}
              </Text>
            </View>
            <ChevronDown />
          </View>
        </TouchableOpacity>

        {/* Parties Section */}
        <View style={styles.partiesSection}>
          <Text style={styles.partiesTitle}>
            {voteSubmitted && !isUnlimitedUser ? "Your Vote Status" : "Vote for your Party"}
          </Text>          
          
          {/* Party Grid */}
          <View style={styles.partyGrid}>
            {renderPartyGrid()}
          </View>

          {/* See More/Less Button (only show if vote not submitted) */}
          {!voteSubmitted && allParties.length > 8 && (
            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={() => setShowAllParties(!showAllParties)}
            >
              <Text style={styles.seeMoreButtonText}>
                {showAllParties ? "Show Less" : `See More (${allParties.length - 8} more)`}
              </Text>
            </TouchableOpacity>
          )}

          {/* Submit Button for unlimited users */}
          {isUnlimitedUser && selectedDistrict && selectedAssembly && selectedParty && (
            <TouchableOpacity 
              style={[
                styles.submitButton,
                styles.submitButtonUnlimited,
                loading && styles.submitButtonDisabled
              ]}
              disabled={loading}
              onPress={handleSubmitVote}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Submitting..." : `Submit Vote #${unlimitedVoteCount + 1}`}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.simpleButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ElectionVotePage1")}
              style={styles.simpleButton}
              activeOpacity={0.7}
            >
              <Text style={styles.simpleButtonIcon}>🗳️</Text>
              <Text style={styles.simpleButtonText}>Candidates survive</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Info - Always visible if something is selected */}
        {(selectedDistrict || selectedAssembly || selectedParty) && !voteSubmitted && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedInfoTitle}>
              {isUnlimitedUser ? `Current Selection (Vote #${unlimitedVoteCount + 1})` : "Current Selection"}
            </Text>
            
            {selectedDistrict && (
              <View style={styles.selectionItem}>
                <Text style={styles.selectionItemLabel}>District:</Text>
                <Text style={styles.selectionItemValue}>{selectedDistrict.name}</Text>
              </View>
            )}
            
            {selectedAssembly && (
              <View style={styles.selectionItem}>
                <Text style={styles.selectionItemLabel}>Assembly:</Text>
                <Text style={styles.selectionItemValue}>
                  {selectedAssembly.en} ({selectedAssembly.ta})
                </Text>
              </View>
            )}
            
            {selectedParty && (
              <View style={styles.selectionItem}>
                <Text style={styles.selectionItemLabel}>Party:</Text>
                <Text style={styles.selectionItemValue}>{selectedParty.name}</Text>
              </View>
            )}
            
            {isUnlimitedUser && (
              <View style={styles.unlimitedNote}>
                <Text style={styles.unlimitedNoteText}>
                  ⚡ Unlimited Voting: User ID 3 can submit unlimited votes
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Submit Popup Modal */}
        <Modal
          visible={showSubmitPopup}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSubmitPopup(false)}
        >
          <View style={styles.popupOverlay}>
            <View style={styles.popupContainer}>
              <Text style={styles.popupTitle}>Ready to Vote?</Text>
              <Text style={styles.popupText}>
                You have selected:
              </Text>
              
              <View style={styles.popupSelection}>
                <Text style={styles.popupSelectionText}>
                  <Text style={styles.popupLabel}>District:</Text> {selectedDistrict?.name}
                </Text>
                <Text style={styles.popupSelectionText}>
                  <Text style={styles.popupLabel}>Assembly:</Text> {selectedAssembly?.en}
                </Text>
                <Text style={styles.popupSelectionText}>
                  <Text style={styles.popupLabel}>Party:</Text> {selectedParty?.name}
                </Text>
              </View>
              
              <Text style={styles.popupWarning}>
                ⚠️ You can only vote once. This action cannot be undone.
              </Text>
              
              <View style={styles.popupButtons}>
                <TouchableOpacity
                  style={[styles.popupButton, styles.popupButtonCancel]}
                  onPress={() => setShowSubmitPopup(false)}
                >
                  <Text style={styles.popupButtonCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.popupButton, styles.popupButtonSubmit]}
                  onPress={handleSubmitVote}
                  disabled={loading}
                >
                  <Text style={styles.popupButtonSubmitText}>
                    {loading ? "Submitting..." : "Submit Vote"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* District Modal */}
        <Modal
          visible={districtModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select District</Text>
                <TouchableOpacity onPress={() => setDistrictModal(false)}>
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
              />
            </View>
          </View>
        </Modal>

        {/* Assembly Modal */}
        <Modal
          visible={assemblyModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Select Assembly ({selectedDistrict?.name})
                </Text>
                <TouchableOpacity onPress={() => setAssemblyModal(false)}>
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
                    <Text style={styles.listItemSubText}>{item.ta}</Text>
                    {selectedAssembly?.id === item.id && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#93210A",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  electionResultBtn: {
    backgroundColor: '#93210A',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  electionResultBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#93210A",
  },
  unlimitedUserInfo: {
    backgroundColor: "#d1fae5",
    borderLeftColor: "#10b981",
  },
  userInfoText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 5,
  },
  unlimitedStats: {
    marginTop: 5,
  },
  unlimitedVoteCount: {
    fontSize: 14,
    color: "#065f46",
    fontWeight: '600',
  },
  viewVotesButton: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#10b981',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewVotesButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  selectionBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledCard: {
    opacity: 0.7,
  },
  selectionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectionText: {
    flex: 1,
  },
  selectionLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#93210A",
  },
  placeholder: {
    fontSize: 16,
    color: "#94a3b8",
  },
  iconText: {
    fontSize: 20,
    color: "#666",
  },
  selectedInfo: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderLeftWidth: 4,
    borderLeftColor: "#93210A",
  },
  selectedInfoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 16,
  },
  selectionItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: 'center',
  },
  selectionItemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    width: 80,
  },
  selectionItemValue: {
    fontSize: 14,
    color: "#1e293b",
    flex: 1,
  },
  unlimitedNote: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#d1fae5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  unlimitedNoteText: {
    fontSize: 12,
    color: '#065f46',
    fontStyle: 'italic',
  },
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
    backgroundColor: "#93210A",
  },
  partiesSection: {
    marginTop: 20,
  },
  partiesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 8,
    textAlign: "center",
  },
  partyGrid: {
    marginBottom: 20,
  },
  partyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  partyCard: {
    backgroundColor: "white",
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  partyCardSelected: {
    borderColor: "#93210A",
    backgroundColor: "#fef2f2",
  },
  partyCardEmpty: {
    width: "48%",
  },
  partyLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#93210A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: 'hidden',
  },
  partyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  partyLogoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  partyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  partyAbbr: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    fontStyle: 'italic',
  },
  seeMoreButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  seeMoreButtonText: {
    color: "#93210A",
    fontWeight: "600",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#93210A",
    borderRadius: 12,
    padding: 18,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonUnlimited: {
    backgroundColor: "#10b981",
  },
  submitButtonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  resultButtonHeader: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  resultTextHeader: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  resultButtonMain: {
    backgroundColor: "#1e40af",
    borderRadius: 12,
    padding: 18,
    marginTop: 24,
    marginBottom: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3b82f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  resultTextMain: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontStyle: 'italic',
  },
  simpleButtonContainer: {
    margin: 40,
  },
  simpleButton: {
    backgroundColor: '#93210A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simpleButtonIcon: {
    fontSize: 24,
    marginRight: 10,
    color: '#FFD700',
  },
  simpleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Popup Styles
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#93210A',
    marginBottom: 16,
    textAlign: 'center',
  },
  popupText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  popupSelection: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  popupSelectionText: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 6,
  },
  popupLabel: {
    fontWeight: '600',
    color: '#93210A',
  },
  popupWarning: {
    fontSize: 14,
    color: '#dc2626',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  popupButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  popupButtonCancel: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  popupButtonSubmit: {
    backgroundColor: '#93210A',
  },
  popupButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  popupButtonSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Vote Submitted Styles
  voteSubmittedContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1fae5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  voteSubmittedIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  voteSubmittedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 8,
  },
  voteSubmittedText: {
    fontSize: 16,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  viewResultsButton: {
    backgroundColor: '#1e40af',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 20,
  },
  viewResultsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  selectedVoteDetails: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  selectedVoteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#93210A',
    marginBottom: 12,
  },
  selectedVoteText: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 20,
  },
  voteDetailLabel: {
    fontWeight: '600',
    color: '#666',
  },
  selectedPartyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  selectedPartyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#93210A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: 'hidden',
  },
  selectedPartyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedPartyLogoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  selectedPartyInfo: {
    flex: 1,
  },
  selectedPartyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  selectedPartyAbbr: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: 'italic',
  },
});