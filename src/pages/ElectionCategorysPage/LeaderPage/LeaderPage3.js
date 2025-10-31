import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';

const LeaderPage3 = () => {
  const navigation = useNavigation();


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>Swami Vivekananda</Text>
        <Text style={styles.title1} >Hindu leader</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Image */}
      <Image
        source={require('../../../../assets/Leader/swami.jpg')}
        style={styles.image1}
        resizeMode="cover"
      />

      {/* Description */}
      <Text style={styles.description1}>
        Swami Vivekananda, born on January 12, 1863, in Calcutta (now Kolkata),
        and passed away on July 4, 1902, near Calcutta, was a renowned Hindu monk,
        spiritual leader, preacher, and reformer who played a key role in spreading
        Vedanta philosophy both in India and abroad. As the chief disciple of the
        revered mystic Ramakrishna, he emphasized the practical application of
        spirituality in everyday life and was instrumental in interpreting Indian
        philosophies like Vedanta and Yoga to the Western world.{"\n\n"}
        His historic speech at the World’s Parliament of Religions in Chicago in 1893,
        where he began with the words “Sisters and brothers of America,” gained him
        international recognition and marked a turning point in the global understanding
        of Hinduism. Swami Vivekananda believed in the ideals of social service,
        selfless action, and nurturing the highest virtues.{"\n\n"}
      </Text>

      {/* Section Title */}
      <Text style={styles.sectionTitle1}>Birth, family, and early life</Text>
      <View style={styles.titleUnderline1} />

      {/* Section Content */}
      <View style={styles.sectionContent}>
        <View style={styles.textBlock}>
          <Text style={styles.description}>
            Narendranath Datta, later known as Swami Vivekananda, was born into an
            upper-middle-class family belonging to the Kayastha (scribes) caste in Bengal.
            His father, Vishwanath Datta, was a cultured and rational-minded attorney at
            the High Court in Calcutta (now Kolkata), while his mother, Bhuvaneshwari Devi,
            was a deeply religious homemaker.{"\n\n"}
            Narendranath was one of eight siblings and was affectionately called “Naren”
            or “Bilé” by his family. As a child, he was full of energy, mischievous, daring,
            and gifted with an exceptional memory. He began his early education at the
            Metropolitan Institute in 1871 and actively participated in extracurricular
            activities, including wrestling and boxing. In 1879, he continued his academic
            journey by enrolling at Presidency College in Calcutta (now Presidency University,
            Kolkata), where his intellectual and personal development continued to flourish.
          </Text>
        </View>

        <View style={styles.imageGrid}>
          <Image
            source={require('../../../../assets/Leader/swamifamily1.jpg')}
            style={styles.gridImage}
          />
          <Image
            source={require('../../../../assets/Leader/swamifamily2.jpg')}
            style={styles.gridImage}
          />
          <Image
            source={require('../../../../assets/Leader/swamifamily3.jpg')}
            style={styles.gridImage}
          />
          <Image
            source={require('../../../../assets/Leader/swamifamily2.jpg')}
            style={styles.gridImage}
          />
          <Image
            source={require('../../../../assets/Leader/swamifamily3.jpg')}
            style={styles.gridImage}
          />
          <Image
            source={require('../../../../assets/Leader/swamifamily2.jpg')}
            style={styles.gridImage}
          />
        </View>
             {/* Spiritual Initiation */}
      <Text style={styles.sectionTitle}>Spiritual initiation</Text>
      <View style={styles.titleUnderline} />

      <View style={styles.spiritualSection}>
        <Text style={styles.description}>
          Narendranath Datta is believed to have had mystical experiences during his childhood, which sparked a growing spiritual curiosity about the existence of God. In 1881, this search led him to meet Ramakrishna, a revered Hindu mystic and devoted follower of the goddess Kali.
          {"\n\n"}
          Ramakrishna would go on to play a pivotal role in shaping Narendranath’s spiritual journey. At the time, Narendranath was a member of the Brahmo Samaj and had been influenced by Western education, logic, and rational thought, which made him initially skeptical of Ramakrishna’s deep devotion and spiritual practices. However, as he spent more time with the mystic, his skepticism gradually transformed into faith, and he eventually accepted Ramakrishna as his guru.
          {"\n\n"}
          Under Ramakrishna’s guidance, Narendranath explored the depths of spiritual knowledge and began to form his own spiritual worldview. Recognizing his disciple’s potential, Ramakrishna chose Narendranath as his spiritual successor and, before his death in 1886, initiated him and other disciples into monkhood, thus preparing them to carry forward his teachings.
        </Text>

        <Image
          source={require('../../../../assets/Leader/swami.jpg')} // 👈 Add your image here
          style={styles.spiritualImage}
        />
      </View>
            {/* Life as a Monk */}
      <Text style={styles.sectionTitle}>
        Life as a monk
      </Text>
      <Text style={styles.subsectionTitle}>
        Travels in India and to the World’s Parliament of Religions in Chicago
      </Text>
      <View style={styles.titleUnderline} />

      <Image
        source={require('../../../../assets/Leader/swami.jpg')} // First image
        style={styles.spiritualImage}
      />
      <Image
        source={require('../../../../assets/Leader/swami.jpg')} // Second image
        style={styles.spiritualImage}
      />

      <Text style={styles.description}>
        Around 1890, Narendranath Datta began a journey across India as a wandering monk, adopting names such as Vividishananda and Sachchidananda.{"\n\n"}
        During this period, he traveled extensively through various cities and states, interacting with people from different social classes and closely observing the religious and social conditions of Hindu society. These experiences played a vital role in shaping his spiritual philosophy and commitment to social reform.{"\n\n"}
        Before his departure for the 1893 World's Parliament of Religions in Chicago, he was given the name “Vivekananda” by Raja Ajit Singh of Khetri, a devoted follower and supporter. The name, derived from the Sanskrit words viveka (meaning “conscience” or “discernment”) and ananda (meaning “bliss” or “joy”), reflected his enlightened vision and joyful spirit.{"\n\n"}
        Motivated by encouragement from disciples and well-wishers, Vivekananda decided to represent Hinduism at the Parliament, a global platform for interfaith dialogue.
      </Text>

      </View>
            {/* Philosophy, discourses, and teachings */}
      <Text style={styles.sectionTitle}>
        Philosophy, discourses, and teachings
      </Text>
      <View style={styles.titleUnderline} />

      <Image
        source={require('../../../../assets/Leader/swami.jpg')} // First image
        style={styles.spiritualImage}
      />
      <Image
        source={require('../../../../assets/Leader/swami.jpg')} // Second image
        style={styles.spiritualImage}
      />

      <Text style={styles.description}>
        Swami Vivekananda was a devoted proponent of Vedanta philosophy and worked tirelessly to explain the fundamental principles of Hinduism and spirituality through his many discourses. He explored a wide range of subjects, including yoga, bhakti (devotion), atman (the self), and maya (illusion), while drawing on texts like the Bhagavad Gita, the Ramayana, and the Mahabharata.{"\n\n"}
        Emphasizing the humanistic side of Vedanta, he advocated for universal oneness, self-improvement, and a rejection of dogma and superstition. He believed in the importance of developing the body as well as the mind, once stating that playing football could bring a person closer to God than merely reading the Bhagavad Gita.{"\n\n"}
        By making the highest ideals of Vedanta relevant to the everyday person, he aimed to breathe new life into Hindu thought and promote spiritual awakening. At the core of his teachings was the belief that serving humanity—especially the poor and needy—was the noblest path and a true means of attaining divine realization.{"\n\n"}
        This perspective was shaped by his personal experiences as a wandering monk, during which he witnessed the harsh realities of poverty in India. The ideal of selfless service remained central to his life’s work and continues to be upheld by the Ramakrishna Order and his followers.
      </Text>

        {/* Section Title */}
      <Text style={styles.sectionTitle}>Legacy</Text>
      <View style={styles.titleUnderline} />

      {/* Description */}
      <Text style={styles.description}>
        In 1900, Swami Vivekananda returned to India after his second visit abroad, but his health had started to deteriorate. He passed away two years later at the age of just 39. Despite his brief life, Vivekananda left behind a lasting legacy through his profound teachings, philosophy, and the dedicated efforts of his disciples. His speeches and writings continue to inspire people in India and across the world.{"\n\n"}
        Since 1985, his birthday has been celebrated as National Youth Day in India, recognizing his enduring influence on the nation’s youth. The organizations he founded, the Ramakrishna Math and Ramakrishna Mission, have grown extensively and now operate over 200 centers worldwide, including in more than 20 countries outside India.{"\n\n"}
        During his time in the West, Vivekananda established two Vedanta Societies—the first in New York City in 1894 and another in San Francisco in 1900. These were the first such institutions in the Western world, and over time, they have expanded significantly, with many centers now established throughout the United States.
      </Text>

      {/* Image */}
      <Image
        source={require('../../../../assets/Leader/swami.jpg')} // Replace with your image path
        style={styles.image}
        resizeMode="cover"
      />
       <View style={styles.container}>
      <Text style={styles.title}>VIDEOS</Text>
      <YoutubePlayer
        height={200}
        play={false}
        videoId="5-szmzI0zvQ"  // Replace with your YouTube video ID
        webViewStyle={{ borderRadius: 10 }} // optional rounded corners on player
      />
    </View>
    </ScrollView>
  );
};

   

export default LeaderPage3;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  arrowButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
  },
  header: {
    marginTop: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B2E2E',
    marginHorizontal:15,
  },
  title1: {
    fontSize: 16,
    color: '#A0522D',
   marginHorizontal:15,
  },
  divider: {
    height: 2,
    backgroundColor: '#8B0000',
    marginVertical: 10,
    width: '100%',
  },
  image1: {
    width: 340,
    height: 300,
    marginBottom: 15,
    borderRadius: 10,
  },
  description1: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    textAlign:"justify"
  },
  sectionTitle1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
    marginTop: -20,
    marginBottom: 4,
  },
  titleUnderline1: {
    height: 2,
    backgroundColor: '#8B0000',
    width: 100,
    marginBottom: 10,
    width:179,
  },
  sectionContent: {
    flexDirection: 'column',
  },
  textBlock: {
    marginBottom: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridImage: {
    width: '30%',
    height: 100,
    marginBottom: 10,
    borderRadius: 6,
    resizeMode: 'cover',
  
  },
    spiritualSection: {
    flexDirection: 'column',
    marginTop: 10,
  },
  spiritualImage: {
    width: '100%',
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
    sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
    marginTop: 25,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B0000',
    marginBottom: 4,
  },
  titleUnderline: {
    height: 2,
    width: 120,
    backgroundColor: '#8B0000',
    marginBottom: 10,
  },
    spiritualImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
    marginTop: 25,
  },
  titleUnderline: {
    height: 2,
    width: 120,
    backgroundColor: '#8B0000',
    marginBottom: 10,
  },
    sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B0000', // Dark red
    marginBottom: 6,
  },
  titleUnderline: {
    height: 3,
    width: 80,
    backgroundColor: '#8B0000',
    marginBottom: 12,
    borderRadius: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
   container: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#8B0000',  
  },


});
