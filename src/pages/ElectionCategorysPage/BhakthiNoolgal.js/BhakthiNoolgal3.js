import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const BhakthiNoolgal3 = ({ route, navigation }) => {
  const { book } = route.params;
  const [currentChapter, setCurrentChapter] = useState(1);
  const totalChapters = 18;

  const chapterContent = {
    1: `முதல் அதிகாரம்: அருச்சுனனின் துக்கம்\n\nதிருதராஷ்ட்ரன் கூறினார்: ஹே ஸஞ்சய! புனிதமான குருஷேத்திரப் போர்க்களத்தில் கூடி, போர் செய்ய விரும்பிய என் பிள்ளைகளும் பாண்டவர்களும் என்ன செய்தார்கள்?`,
    2: `இரண்டாம் அதிகாரம்: ஞான யோகம்\n\nஸஞ்சயன் கூறினார்: அப்படி இரக்கத்தால் வெல்லப்பட்டு, மனம் தளர்ந்து, கண்ணீர் நிறைந்த கண்களுடன் கலங்கிய அவரிடம் மது சூதனன் பின்வரும் வார்த்தைகளைக் கூறினார்.`,
    3: `மூன்றாம் அதிகாரம்: கர்ம யோகம்\n\nஅருச்சுனன் கூறினார்: ஹே ஜனார்த்தனா! நீங்கள் ஞானத்தைச் செயலிலும் மேலானதாகக் கருதினால், அப்படியிருக்கும் போது இந்த அச்சமான செயலில் என்னை ஈடுபடுத்துகிறீர்கள்?`,
  };

  const tamilChapters = {
    1: 'அருச்சுன விஷாத யோகம்',
    2: 'சாங்க்ய யோகம்',
    3: 'கர்ம யோகம்',
    4: 'ஞானகர்மசந்நியாச யோகம்',
    5: 'கர்மசந்நியாச யோகம்',
    6: 'தியான யோகம்',
    7: 'ஞானவிஞான யோகம்',
    8: 'அக்ஷரப்ரம்ம யோகம்',
    9: 'ராஜவித்யாராஜகுஹ்ய யோகம்',
    10: 'விபூதி யோகம்',
    11: 'விஸ்வரூபதர்சன யோகம்',
    12: 'பக்தி யோகம்',
    13: 'க்ஷேத்ரக்ஷேத்ரஞான யோகம்',
    14: 'குணத்ரயவிபாக யோகம்',
    15: 'புருஷோத்தம யோகம்',
    16: 'தைவாஸுரஸம்பத் விபாக யோகம்',
    17: 'ஸ்ரத்தாத்ரயவிபாக யோகம்',
    18: 'மோக்ஷசந்நியாச யோகம்',
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < totalChapters) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const renderChapterContent = () => {
    const tamilChapterName = tamilChapters[currentChapter] || `அதிகாரம் ${currentChapter}`;
    const englishContent = chapterContent[currentChapter] || '';
    
    return (
      <View style={styles.contentBox}>
        <Text style={styles.chapterName}>
          {tamilChapterName}
        </Text>
        
        <Text style={styles.contentText}>
          {englishContent || `இது ${book.title} நூலின் ${currentChapter}வது அதிகாரம். முழு உள்ளடக்கம் உங்கள் தரவு மூலத்திலிருந்து பெறப்படும். இது ஒரு தற்காலிக உள்ளடக்கமாகும்.`}
        </Text>
        
        <View style={styles.verseContainer}>
          <Text style={styles.verseTitle}>பாடல்:</Text>
          <Text style={styles.verseText}>
            "நியமிக்கப்பட்ட கடமைகளைச் செய்ய உனக்கு உரிமை உண்டு; ஆனால் செயல்களின் பலன்களுக்கு உனக்கு உரிமை இல்லை. உன் செயல்களின் பலன்களுக்கு உன்னைக் காரணமாகக் கருதாதே; செயலற்ற தன்மையிலும் துவயம் கொள்ளாதே."
          </Text>
          <Text style={styles.verseSource}>- பகவத் கீதை 2:47</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📚 {book.title}</Text>
        <Text style={styles.chapterInfo}>
          அதிகாரம் {currentChapter} / {totalChapters}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderChapterContent()}
        
        <View style={styles.navigationHelp}>
          <Text style={styles.helpText}>⬇️ கீழே உள்ள பொத்தான்களைப் பயன்படுத்தி அதிகாரங்களுக்குச் செல்லவும்</Text>
        </View>

        <View style={styles.chapterList}>
          <Text style={styles.chapterListTitle}>அதிகாரங்கள்:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.chapterScroll}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((chapter) => (
              <TouchableOpacity
                key={chapter}
                style={[
                  styles.chapterButton,
                  currentChapter === chapter && styles.activeChapterButton
                ]}
                onPress={() => setCurrentChapter(chapter)}
              >
                <Text style={[
                  styles.chapterButtonText,
                  currentChapter === chapter && styles.activeChapterButtonText
                ]}>
                  {chapter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton, currentChapter === 1 && styles.disabledButton]}
            onPress={handlePreviousChapter}
            disabled={currentChapter === 1}
          >
            <Text style={styles.navButtonText}>← முந்தையது</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.centerButton, styles.chapterButton]}
            onPress={() => {
              // Show chapter selection
            }}
          >
            <Text style={styles.centerButtonText}>அதி. {currentChapter}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, currentChapter === totalChapters && styles.disabledButton]}
            onPress={handleNextChapter}
            disabled={currentChapter === totalChapters}
          >
            <Text style={styles.navButtonText}>அடுத்தது →</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← நூல் விவரங்களுக்குத் திரும்பு</Text>
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
  headerBar: {
    backgroundColor: '#93210A',
    padding: 18,
    paddingTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'TamilFont',
  },
  chapterInfo: {
    color: '#FFD1C1',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'TamilFont',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 25,
    paddingBottom: 30,
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#93210A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE5D9',
  },
  chapterName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#93210A',
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: 'TamilFont',
    lineHeight: 35,
  },
  contentText: {
    fontSize: 19,
    lineHeight: 34,
    color: '#333333',
    textAlign: 'justify',
    fontFamily: 'TamilFont',
    marginBottom: 30,
  },
  verseContainer: {
    backgroundColor: '#FFF8F5',
    padding: 22,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#93210A',
    marginTop: 20,
  },
  verseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#93210A',
    marginBottom: 12,
    fontFamily: 'TamilFont',
  },
  verseText: {
    fontSize: 17,
    lineHeight: 32,
    color: '#444444',
    fontStyle: 'italic',
    fontFamily: 'TamilFont',
    textAlign: 'justify',
  },
  verseSource: {
    fontSize: 15,
    color: '#666666',
    marginTop: 15,
    textAlign: 'right',
    fontStyle: 'italic',
    fontFamily: 'TamilFont',
  },
  navigationHelp: {
    marginTop: 30,
    marginBottom: 25,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFE5D9',
    borderStyle: 'dashed',
  },
  helpText: {
    color: '#93210A',
    fontSize: 15,
    fontFamily: 'TamilFont',
    textAlign: 'center',
  },
  chapterList: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE5D9',
  },
  chapterListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#93210A',
    marginBottom: 15,
    fontFamily: 'TamilFont',
  },
  chapterScroll: {
    flexDirection: 'row',
  },
  chapterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeChapterButton: {
    backgroundColor: '#93210A',
    borderColor: '#93210A',
  },
  chapterButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'TamilFont',
  },
  activeChapterButtonText: {
    color: '#FFFFFF',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#93210A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navButton: {
    backgroundColor: '#93210A',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#93210A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  prevButton: {
    marginRight: 10,
  },
  nextButton: {
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'TamilFont',
  },
  centerButton: {
    backgroundColor: '#FFE5D9',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#93210A',
  },
  centerButtonText: {
    color: '#93210A',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'TamilFont',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#93210A',
  },
  backButtonText: {
    color: '#93210A',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'TamilFont',
  },
});

export default BhakthiNoolgal3;




