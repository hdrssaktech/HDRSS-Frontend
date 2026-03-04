import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";


const { width } = Dimensions.get('window');

const Election2021Screen = ({ navigation }) => {
  // Election data
  const electionData = {
    totalSeats: 234,
    alliances: [
      {
        name: 'DMK Alliance',
        color: '#E53935',
        gradient: ['#FF5252', '#E53935'],
        icon: '☀️',
        parties: [
          {
            name: 'திராவிட முன்னேற்றக் கழகம் (DMK)',
            seats: 133,
            votes: 21625344,
            symbol: '☀️',
            leader: 'எம்.கே.ஸ்டாலின்',
            color: '#FF5252',
          },
          {
            name: 'இந்திய தேசிய காங்கிரஸ் (INC)',
            seats: 18,
            votes: 2400000,
            symbol: '🤚',
            leader: 'கே.சி. வெங்கட்ராமன்',
            color: '#FF9800',
          },
          {
            name: 'மார்க்சிஸ்ட் கம்யூனிஸ்ட் கட்சி (CPM)',
            seats: 2,
            votes: 850000,
            symbol: '☭',
            leader: 'கே. பாலகிருஷ்ணன்',
            color: '#F44336',
          },
          {
            name: 'மார்க்சிஸ்ட் கம்யூனிஸ்ட் கட்சி (CPI)',
            seats: 2,
            votes: 820000,
            symbol: '☭',
            leader: 'ஆர். முத்துக்குமார்',
            color: '#D32F2F',
          },
          {
            name: 'விதுதளாய் சிறுத்தைகள் கட்சி (VCK)',
            seats: 4,
            votes: 950000,
            symbol: '🐯',
            leader: 'திருமாவள்ளவன்',
            color: '#FF5722',
          },
        ],
        totalSeats: 159,
        totalVotes: 26625344,
      },
      {
        name: 'AIADMK Alliance',
        color: '#43A047',
        gradient: ['#66BB6A', '#43A047'],
        icon: '🍃',
        parties: [
          {
            name: 'அண்ணா திராவிட முன்னேற்றக் கழகம் (AIADMK)',
            seats: 66,
            votes: 17623284,
            symbol: '🍃',
            leader: 'எடப்பாடி கே. பழனிசாமி',
            color: '#4CAF50',
          },
          {
            name: 'பாட்டாளி மக்கள் கட்சி (PMK)',
            seats: 5,
            votes: 2000000,
            symbol: '🐔',
            leader: 'அன்புமணி ராமதாஸ்',
            color: '#8BC34A',
          },
          {
            name: 'தமிழ் மாநில காங்கிரஸ்',
            seats: 4,
            votes: 1500000,
            symbol: '🌺',
            leader: 'ஜி. கே. வாசன்',
            color: '#AED581',
          },
        ],
        totalSeats: 75,
        totalVotes: 21123284,
      },
      {
        name: 'Others',
        color: '#757575',
        gradient: ['#9E9E9E', '#757575'],
        icon: '📊',
        parties: [
          {
            name: 'சுயேட்சைகள்',
            seats: 3,
            votes: 1800000,
            symbol: '📊',
            color: '#9E9E9E',
          },
          {
            name: 'நாடா (NOTA)',
            seats: 0,
            votes: 175616,
            symbol: '✖️',
            color: '#607D8B',
          },
        ],
        totalSeats: 3,
        totalVotes: 1975616,
      },
    ],
    summary: {
      totalVoters: 60000000,
      votesPolled: 55000000,
      turnoutPercentage: 73.0,
    },
  };

  // Calculate percentages
  const calculatePercentage = (votes) => {
    const totalVotes = 55000000;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const calculateSeatPercentage = (seats) => {
    return ((seats / electionData.totalSeats) * 100).toFixed(1);
  };

  const StatCard = ({ label, value, percentage, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statPercentage}>{percentage}%</Text>
    </View>
  );

  const PartyCard = ({ party, color }) => (
    <TouchableOpacity 
      style={[styles.partyCard, { borderLeftColor: color }]}
      activeOpacity={0.7}
    >
      <View style={styles.partyHeader}>
        <View style={[styles.partySymbolContainer, { backgroundColor: color }]}>
          <Text style={styles.partySymbol}>{party.symbol}</Text>
        </View>
        <View style={styles.partyInfo}>
          <Text style={styles.partyName} numberOfLines={2}>
            {party.name}
          </Text>
          {party.leader && (
            <Text style={styles.leaderText}>{party.leader}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.partyStats}>
        <View style={styles.partyStat}>
          <Text style={styles.partyStatLabel}>Seats</Text>
          <Text style={styles.partyStatValue}>{party.seats}</Text>
          <View style={[styles.seatBar, { width: `${(party.seats / 133) * 100}%`, backgroundColor: color }]} />
        </View>
        <View style={styles.partyStat}>
          <Text style={styles.partyStatLabel}>Votes</Text>
          <Text style={styles.partyStatValue}>
            {(party.votes / 1000000).toFixed(1)}M
          </Text>
          <View style={[styles.voteBar, { width: `${calculatePercentage(party.votes)}%`, backgroundColor: color }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const AllianceSection = ({ alliance, index }) => (
    <View style={styles.allianceSection}>
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
            color={party.color || alliance.color} 
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>தமிழ்நாடு 2021</Text>
            <Text style={styles.heroSubtitle}>சட்டமன்றத் தேர்தல் முடிவுகள்</Text>
          </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          
          <View style={styles.heroStats}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{electionData.totalSeats}</Text>
              <Text style={styles.mainStatLabel}>Total Seats</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{electionData.summary.turnoutPercentage}%</Text>
              <Text style={styles.mainStatLabel}>Voter Turnout</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>
                {(electionData.summary.votesPolled / 10000000).toFixed(1)} Cr
              </Text>
              <Text style={styles.mainStatLabel}>Votes Polled</Text>
            </View>
          </View>
        </View>

        {/* Seat Distribution Chart */}
        <View style={styles.seatDistribution}>
          <Text style={styles.sectionTitle}>Seat Distribution</Text>
          <View style={styles.distributionBar}>
            {electionData.alliances.map((alliance, index) => (
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
            {electionData.alliances.map((alliance, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: alliance.color }]} />
                <Text style={styles.legendText}>
                  {alliance.name} - {alliance.totalSeats} seats
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <StatCard
            label="Winning Alliance"
            value="DMK"
            percentage="68.0"
            color="#E53935"
          />
          <StatCard
            label="Margin"
            value="84"
            percentage="35.9"
            color="#FF9800"
          />
          <StatCard
            label="Turnout"
            value="73.0%"
            percentage="73.0"
            color="#43A047"
          />
        </View>

        {/* Alliance Results */}
        <Text style={styles.sectionTitle}>Alliance & Party Results</Text>
        {electionData.alliances.map((alliance, index) => (
          <AllianceSection key={index} alliance={alliance} index={index} />
        ))}

        {/* Key Highlights */}
        <View style={styles.highlightsSection}>
          <Text style={styles.sectionTitle}>Key Highlights</Text>
          <View style={styles.highlightsGrid}>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightIcon}>🏆</Text>
              <Text style={styles.highlightTitle}>Clear Majority</Text>
              <Text style={styles.highlightText}>
                DMK alliance secured 159 seats (68%)
              </Text>
            </View>
            
            <View style={styles.highlightCard}>
              <Text style={styles.highlightIcon}>👑</Text>
              <Text style={styles.highlightTitle}>Chief Minister</Text>
              <Text style={styles.highlightText}>
                M.K. Stalin wins from Kolathur
              </Text>
            </View>
            
            <View style={styles.highlightCard}>
              <Text style={styles.highlightIcon}>📈</Text>
              <Text style={styles.highlightTitle}>High Turnout</Text>
              <Text style={styles.highlightText}>
                73% voter participation
              </Text>
            </View>
            
            <View style={styles.highlightCard}>
              <Text style={styles.highlightIcon}>✖️</Text>
              <Text style={styles.highlightTitle}>NOTA Votes</Text>
              <Text style={styles.highlightText}>
                175,616 votes (1%)
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Election Commission of Tamil Nadu</Text>
          <Text style={styles.footerSubtext}>Data based on 2021 Assembly Elections</Text>
          <View style={styles.footerBadge}>
            <Text style={styles.footerBadgeText}>OFFICIAL DATA</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  heroSection: {
    backgroundColor: '#1A237E',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    marginBottom: 20,
  },
  heroHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  mainStat: {
    alignItems: 'center',
    flex: 1,
  },
  mainStatValue: {
    fontSize: 32,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginHorizontal: 20,
    marginVertical: 15,
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
  },
  partyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 20,
  },
  leaderText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 3,
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
});

export default Election2021Screen;