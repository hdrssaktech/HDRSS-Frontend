import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get('window');

// ✅ Styles
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  sidebarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    elevation: 10,
    zIndex: 100,
  },

  // Election Button
  centerButtonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  gradientButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  advertisementWrapper: {
    marginTop: -15,
    marginBottom: 5,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    marginLeft: 15,
  },
  more: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    color: "#93210A",
    marginRight: 15,
    marginTop: 5,
  },
  newsContent: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 16,
  },
  newsImage: { width: 150, height: 120, borderRadius: 6, marginRight: 10 },
  newsCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: "#93210A",
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    marginBottom: 26,
  },

  // ✨ Modern Circle Menu Styles
  circleMenuContainer: {
    marginTop: 20,
    marginBottom: 50,
    paddingBottom: 10,
  },
  horizontalScroll: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  circleCardWrapper: {
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 100,
    shadowColor: "#ff8800",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    padding: 5,
  },
  circleGradient: {
    borderRadius: 100,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  circleImageHorizontal: {
    width: screenWidth / 3.3, // Fixed: using screenWidth instead of undefined width
    height: screenWidth / 3.3,
    borderRadius: screenWidth / 6.6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
    color: "#a34100",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});