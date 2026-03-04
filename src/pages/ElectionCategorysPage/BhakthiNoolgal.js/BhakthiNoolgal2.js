import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const BhakthiNoolgal2 = ({ route, navigation }) => {
  const { book } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bookHeader}>
          <View style={styles.largeBookIcon}>
            <Text style={styles.largeBookIconText}>{book.title.charAt(0)}</Text>
          </View>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>எழுதியவர்: {book.author}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>நூல் விவரம்</Text>
            <View style={styles.sectionUnderline} />
          </View>
          <Text style={styles.description}>
            {book.tamilDescription || book.description}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>நூல் விவரங்கள்</Text>
            <View style={styles.sectionUnderline} />
          </View>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>அ</Text>
              </View>
              <Text style={styles.detailLabel}>அதிகாரங்கள்</Text>
              <Text style={styles.detailValue}>18</Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>ப</Text>
              </View>
              <Text style={styles.detailLabel}>பக்கங்கள்</Text>
              <Text style={styles.detailValue}>700</Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>ம</Text>
              </View>
              <Text style={styles.detailLabel}>மொழி</Text>
              <Text style={styles.detailValue}>தமிழ்</Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>வ</Text>
              </View>
              <Text style={styles.detailLabel}>வகை</Text>
              <Text style={styles.detailValue}>பக்தி நூல்</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>மாதிரி உள்ளடக்கம்</Text>
            <View style={styles.sectionUnderline} />
          </View>
          <Text style={styles.sampleContent}>
            "ஆத்மா பிறப்பதில்லை; இறப்பதுமில்லை. இது பிறந்ததுமில்லை; பிறக்கப்போவதுமில்லை. இது பழமையானது; என்றும் இருக்கும்; உடல் கொல்லப்பட்டாலும் கொல்லப்படாது."
          </Text>
          <Text style={styles.sampleSource}>- பகவத் கீதை, அதிகாரம் 2, வரி 20</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => navigation.navigate('BhakthiNoolgal3', { book })}
        >
          <Text style={styles.readButtonText}>📖 நூலை வாசிக்க</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← முந்தைய பக்கம்</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  bookHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#93210A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFE5D9',
  },
  largeBookIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#93210A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFD1C1',
  },
  largeBookIconText: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: 'bold',
    fontFamily: 'TamilFont',
  },
  bookTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#93210A',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'TamilFont',
  },
  bookAuthor: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'TamilFont',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#93210A',
    fontFamily: 'TamilFont',
  },
  sectionUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#93210A',
    marginTop: 8,
    borderRadius: 2,
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    color: '#444444',
    textAlign: 'justify',
    fontFamily: 'TamilFont',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#FFF8F5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#93210A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'TamilFont',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
    fontFamily: 'TamilFont',
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#93210A',
    fontFamily: 'TamilFont',
  },
  sampleContent: {
    fontSize: 18,
    lineHeight: 32,
    color: '#444444',
    fontStyle: 'italic',
    backgroundColor: '#FFF8F5',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#93210A',
    textAlign: 'justify',
    fontFamily: 'TamilFont',
  },
  sampleSource: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'right',
    fontFamily: 'TamilFont',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#93210A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },
  readButton: {
    backgroundColor: '#93210A',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#93210A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'TamilFont',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93210A',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    color: '#93210A',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'TamilFont',
  },
});

export default BhakthiNoolgal2;