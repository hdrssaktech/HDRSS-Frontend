import React, { useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ALL IMAGES
const images = [
  require("../../../assets/caucus/UAU/UAU_page-0001.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0002.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0003.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0004.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0005.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0006.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0007.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0008.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0009.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0010.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0011.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0012.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0013.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0014.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0015.jpg"),
  require("../../../assets/caucus/UAU/UAU_page-0016.jpg"),
];

export default function PDFViewerScreen() {

  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  // NEXT PAGE
  const nextPage = () => {
    if (currentIndex < images.length - 1) {

      const nextIndex = currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }
  };

  // PREVIOUS PAGE
  const prevPage = () => {
    if (currentIndex > 0) {

      const prevIndex = currentIndex - 1;

      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });

      setCurrentIndex(prevIndex);
    }
  };

  return (
    <View style={styles.container}>

      {/* IMAGE SLIDER */}
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      />

      {/* PAGE NUMBER */}
      <View style={styles.pageContainer}>
        <Text style={styles.pageText}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={[
            styles.button,
            currentIndex === 0 && styles.disabledButton,
          ]}
          onPress={prevPage}
          disabled={currentIndex === 0}
        >
          <Text style={styles.buttonText}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            currentIndex === images.length - 1 &&
              styles.disabledButton,
          ]}
          onPress={nextPage}
          disabled={currentIndex === images.length - 1}
        >
          <Text style={styles.buttonText}>
            Next
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  image: {
    width,
    height,
  },

  pageContainer: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  pageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  button: {
    backgroundColor: "#a72828",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  disabledButton: {
    backgroundColor: "#555",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});