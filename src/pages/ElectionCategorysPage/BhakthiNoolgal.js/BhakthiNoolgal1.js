import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// Temporary Tamil book data
const temporaryBooks = [
  { 
    id: '1', 
    title: 'பகவத் கீதை', 
    author: 'வியாசர்', 
    description: 'புனித இந்து வேத நூல்',
    tamilDescription: 'இது ஒரு புனித இந்து வேத நூல் ஆகும். இறைவனின் நேரடி போதனைகளைக் கொண்டுள்ளது.'
  },
  { 
    id: '2', 
    title: 'ராமாயணம்', 
    author: 'வால்மீகி', 
    description: 'இலங்கா விஜயத்தின் கதை',
    tamilDescription: 'இது மகா காவியமான ராமாயணம். ஸ்ரீராம சரித்திரத்தை விவரிக்கிறது.'
  },
  { 
    id: '3', 
    title: 'மகாபாரதம்', 
    author: 'வியாசர்', 
    description: 'பாரதப் போரின் கதை',
    tamilDescription: 'இது பாரதப் போரைக் கூறும் மகா காவியம். கௌரவர்-பாண்டவர் சண்டை.'
  },
  { 
    id: '4', 
    title: 'தேவி மகாத்மியம்', 
    author: 'மார்க்கண்டேயர்', 
    description: 'தேவியின் மகிமை',
    tamilDescription: 'இது தேவியின் மகிமையைப் புகழ்ந்து பாடும் நூல். துர்கா சப்தசதியைக் கொண்டுள்ளது.'
  },
  { 
    id: '5', 
    title: 'சிவ புராணம்', 
    author: 'வியாசர்', 
    description: 'சிவபெருமானின் கதைகள்',
    tamilDescription: 'இது சிவபெருமானின் புராணங்களைக் கொண்ட நூல். சைவ சமயத்தின் முக்கிய நூல்.'
  },
  { 
    id: '6', 
    title: 'விஷ்ணு புராணம்', 
    author: 'பராசரர்', 
    description: 'விஷ்ணுவின் புராணங்கள்',
    tamilDescription: 'இது விஷ்ணு பகவானின் புராணங்களை விவரிக்கும் நூல். வைஷ்ணவ சமயத்தின் முக்கிய நூல்.'
  },
  { 
    id: '7', 
    title: 'திருக்குறள்', 
    author: 'திருவள்ளுவர்', 
    description: 'தமிழ் முதுமொழி நூல்',
    tamilDescription: 'இது உலகப் புகழ் பெற்ற தமிழ் முதுமொழி நூல். அறம், பொருள், இன்பம் பற்றி கூறுகிறது.'
  },
  { 
    id: '8', 
    title: 'தேவாரம்', 
    author: 'திருநாவுக்கரசர்', 
    description: 'சிவ பக்தி பாடல்கள்',
    tamilDescription: 'இது திருநாவுக்கரசர் இயற்றிய சிவ பக்திப் பாடல்களின் தொகுப்பு. தமிழ்ச் சைவ சமயத்தின் முக்கிய நூல்.'
  },
];

const BhakthiNoolgal1 = ({ navigation }) => {
  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BhakthiNoolgal2', { book: item })}
    >
      <View style={styles.bookIcon}>
        <Text style={styles.bookIconText}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>எழுதியவர்: {item.author}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>பக்தி நூல்கள்</Text>
        <Text style={styles.headerSubtitle}>வாசிக்க விரும்பும் நூலைத் தேர்ந்தெடுக்கவும்</Text>
      </View>
      
      <FlatList
        data={temporaryBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>மேலாளர் மதிப்பாய்வுக்கான தற்காலிக ஓட்டம்</Text>
        <Text style={styles.footerSubText}>மொத்தம் {temporaryBooks.length} நூல்கள்</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  header: {
    backgroundColor: '#93210A',
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'TamilFont',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFE5D9',
    textAlign: 'center',
    fontFamily: 'TamilFont',
  },
  listContent: {
    padding: 15,
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#93210A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  bookIcon: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#93210A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFD1C1',
  },
  bookIconText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'TamilFont',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#93210A',
    marginBottom: 4,
    fontFamily: 'TamilFont',
  },
  bookAuthor: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'TamilFont',
  },
  arrow: {
    fontSize: 22,
    color: '#93210A',
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#93210A',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  footerText: {
    fontSize: 13,
    color: '#93210A',
    fontStyle: 'italic',
    fontFamily: 'TamilFont',
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
    fontFamily: 'TamilFont',
  },
});

export default BhakthiNoolgal1;