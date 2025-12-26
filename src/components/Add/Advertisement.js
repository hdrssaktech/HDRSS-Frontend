// import React, { useRef, useEffect, useState } from "react";
// import {
//   View,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import { fetchHomeAds } from "../../Controller/AdvertisementController/AdvertisementController";

// const { width } = Dimensions.get("window");

// export default function AutoScrollAds() {
//   const scrollRef = useRef(null);
//   const [ads, setAds] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Fetch images from controller
//   useEffect(() => {
//     const getAds = async () => {
//       const imageList = await fetchHomeAds();
//       setAds(imageList);
//       setLoading(false);
//     };
//     getAds();
//   }, []);

//   // Auto-scroll every 3 seconds
//   useEffect(() => {
//     if (ads.length === 0) return;
//     const interval = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % ads.length;
//       setCurrentIndex(nextIndex);
//       scrollRef.current?.scrollTo({
//         x: nextIndex * width,
//         animated: true,
//       });
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [currentIndex, ads]);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.adContainer}>
//       <ScrollView
//         ref={scrollRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         scrollEnabled={false}
//       >
//         {ads.map((imageUrl, index) => (
//           <Image
//             key={index}
//             source={{ uri: imageUrl }}
//             style={styles.adImage}
//             resizeMode="cover"
//           />
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   adContainer: {
//     height: 200,
//     marginVertical: 30,
//   },
//   adImage: {
//     width: width,
//     height: 200,
//   },
//   loaderContainer: {
//     height: 200,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });








import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { fetchHomeAds } from "../../Controller/AdvertisementController/AdvertisementController";

export default function AutoScrollAds() {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();

  const isTablet = width >= 600; // ✅ tablet detection

  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ads
  useEffect(() => {
    const getAds = async () => {
      const imageList = await fetchHomeAds();
      setAds(imageList);
      setLoading(false);
    };
    getAds();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, ads, width]);

  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          isTablet && styles.loaderContainerTablet,
        ]}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.adContainer,
        isTablet && styles.adContainerTablet,
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {ads.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={[
              styles.adImage,
              isTablet && styles.adImageTablet,
              { width },
            ]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* 📱 MOBILE */
   adContainer: {
    height: 200,
    marginVertical: 30,
  },
  adImage: {
   
    height: 200,
  },
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  /* 📲 TABLET */
  adContainerTablet: {
    height: 300,
    marginVertical: 40,
  },

  adImageTablet: {
    height: 350,
  },

  loaderContainerTablet: {
    height: 300,
  },
});
