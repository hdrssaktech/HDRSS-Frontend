// screens/OrderConfirmationScreen.js  (route name: ProductScreenOrderConfirm)
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Platform, SafeAreaView, Animated, Dimensions, ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const isTablet = width > 768;

const PAYMENT_LABELS = {
  gpay: "Google Pay",
  phonepe: "PhonePe",
  upi: "UPI",
  card: "Card",
  cod: "Cash on Delivery",
};

export default function ProductScreenOrderConfirm({ navigation, route }) {
  const { orderDetails } = route.params || {};
  const [showItems, setShowItems] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const fmt = (p) => parseFloat(p || 0).toFixed(2);
  const payLabel = PAYMENT_LABELS[orderDetails?.paymentMethod] || "Online";
  const isCOD = orderDetails?.paymentMethod === "cod";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1B6B3A" barStyle="light-content" />

      {/* Header — left-aligned, no center */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Order Confirmed! 🎉</Text>
            <Text style={styles.headerSub}>We've received your order</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Success Animation */}
        <Animated.View style={[styles.successWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.successRing}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={isTablet ? 72 : 52} color="#fff" />
            </View>
          </View>
          <Text style={styles.thankYou}>
            Thank You, {orderDetails?.customerInfo?.name?.split(" ")[0] || ""}! 🙏
          </Text>
          <Text style={styles.confirmMsg}>
            {isCOD
              ? "Your order is confirmed. Pay cash on delivery."
              : "Payment received. Your order is on the way!"}
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Order Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="receipt-outline" size={18} color="#9D1B00" />
              <Text style={styles.cardTitle}>Order Details</Text>
            </View>
            <InfoRow label="Order ID" value={orderDetails?.orderId || "—"} mono />
            <InfoRow label="Date" value={
              orderDetails?.orderDate
                ? new Date(orderDetails.orderDate).toLocaleString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })
                : "—"
            } />
            <InfoRow label="Payment" value={payLabel} />
            <InfoRow
              label="Status"
              value={isCOD ? "Confirmed" : "Paid"}
              valueStyle={{ color: "#25A244", fontWeight: "700" }}
            />
            <InfoRow
              label="Total Paid"
              value={`₹${fmt(orderDetails?.totalAmount)}`}
              valueStyle={{ color: "#9D1B00", fontSize: 18, fontWeight: "800" }}
              last
            />
          </View>

          {/* Delivery Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="location-outline" size={18} color="#9D1B00" />
              <Text style={styles.cardTitle}>Delivery Address</Text>
            </View>
            <Text style={styles.deliveryName}>{orderDetails?.customerInfo?.name || "—"}</Text>
            <Text style={styles.deliveryLine}>{orderDetails?.customerInfo?.address || "—"}</Text>
            <Text style={styles.deliveryLine}>
              {orderDetails?.customerInfo?.city} — {orderDetails?.customerInfo?.pincode}
            </Text>
            <View style={styles.phoneChip}>
              <Ionicons name="call-outline" size={14} color="#9D1B00" />
              <Text style={styles.phoneChipTxt}>{orderDetails?.customerInfo?.phone || "—"}</Text>
            </View>
          </View>

          {/* Items Ordered Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setShowItems((p) => !p)}
              activeOpacity={0.7}
            >
              <Ionicons name="bag-outline" size={18} color="#9D1B00" />
              <Text style={styles.cardTitle}>
                Items Ordered ({orderDetails?.items?.length || 0})
              </Text>
              <View style={{ flex: 1 }} />
              <Ionicons name={showItems ? "chevron-up" : "chevron-down"} size={18} color="#64748B" />
            </TouchableOpacity>

            {showItems ? (
              <View style={{ marginTop: 10 }}>
                {(orderDetails?.items || []).map((item, i) => (
                  <View key={i} style={styles.itemRow}>
                    <View style={styles.itemRowDot} />
                    <Text style={styles.itemRowName} numberOfLines={1}>
                      {item.productName || "Product"}
                    </Text>
                    <Text style={styles.itemRowQty}>×{item.quantity}</Text>
                    <Text style={styles.itemRowPrice}>
                      ₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
                <View style={styles.itemsDivider} />
                <View style={styles.itemsTotal}>
                  <Text style={styles.itemsTotalLabel}>Total</Text>
                  <Text style={styles.itemsTotalVal}>₹{fmt(orderDetails?.totalAmount)}</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setShowItems(true)} style={styles.viewItemsBtn}>
                <Text style={styles.viewItemsTxt}>Tap to view ordered items</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ETA Banner */}
          <View style={styles.etaBanner}>
            <Ionicons name="time-outline" size={22} color="#9D1B00" />
            <View style={{ flex: 1 }}>
              <Text style={styles.etaTitle}>Estimated Delivery</Text>
              <Text style={styles.etaSub}>3 – 5 business days</Text>
            </View>
            <View style={styles.etaBadge}>
              <Text style={styles.etaBadgeTxt}>On Track</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate("ProductScreen4")}
          >
            <Text style={styles.continueTxt}>Continue Shopping</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home-outline" size={18} color="#9D1B00" />
            <Text style={styles.homeBtnTxt}>Go to Home</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, mono, valueStyle, last }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0, marginBottom: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoVal, mono && styles.mono, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  /* ── Header: left-aligned ── */
  header: {
    backgroundColor: "#1B6B3A",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
    shadowColor: "#1B6B3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: isTablet ? 22 : 19,
    fontWeight: "800",
  },
  headerSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    marginTop: 2,
  },

  scroll: { padding: 16, paddingBottom: 40 },

  /* ── Success Animation ── */
  successWrap: { alignItems: "center", paddingVertical: 24 },
  successRing: {
    width: isTablet ? 130 : 100,
    height: isTablet ? 130 : 100,
    borderRadius: 65,
    backgroundColor: "rgba(37,162,68,0.15)",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  successCircle: {
    width: isTablet ? 100 : 76,
    height: isTablet ? 100 : 76,
    borderRadius: 50,
    backgroundColor: "#25A244",
    justifyContent: "center", alignItems: "center",
    elevation: 8, shadowColor: "#25A244",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10,
  },
  thankYou: { fontSize: isTablet ? 26 : 21, fontWeight: "800", color: "#1E1E1E", marginBottom: 6 },
  confirmMsg: {
    fontSize: 14, color: "#64748B", textAlign: "center",
    paddingHorizontal: 20, lineHeight: 20,
  },

  /* ── Cards ── */
  card: {
    backgroundColor: "#fff", borderRadius: 18, padding: 16,
    marginBottom: 14, elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1E1E1E" },

  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", marginBottom: 1,
  },
  infoLabel: { fontSize: 13, color: "#64748B" },
  infoVal: { fontSize: 14, fontWeight: "600", color: "#1E1E1E", maxWidth: "60%", textAlign: "right" },
  mono: { fontFamily: Platform.OS === "ios" ? "Courier" : "monospace", fontSize: 13 },

  deliveryName: { fontSize: 15, fontWeight: "700", color: "#1E1E1E", marginBottom: 4 },
  deliveryLine: { fontSize: 13, color: "#475569", lineHeight: 20, marginBottom: 2 },
  phoneChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#FEF2F2", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, alignSelf: "flex-start", marginTop: 6,
  },
  phoneChipTxt: { fontSize: 13, fontWeight: "600", color: "#9D1B00" },

  itemRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 7 },
  itemRowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#9D1B00" },
  itemRowName: { flex: 1, fontSize: 13, color: "#334155", fontWeight: "500" },
  itemRowQty: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  itemRowPrice: { fontSize: 13, fontWeight: "700", color: "#1E1E1E", marginLeft: 6 },
  itemsDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 8 },
  itemsTotal: { flexDirection: "row", justifyContent: "space-between" },
  itemsTotalLabel: { fontSize: 15, fontWeight: "700", color: "#1E1E1E" },
  itemsTotalVal: { fontSize: 18, fontWeight: "800", color: "#9D1B00" },
  viewItemsBtn: { paddingVertical: 6 },
  viewItemsTxt: { fontSize: 13, color: "#9D1B00", fontWeight: "600", textAlign: "center" },

  etaBanner: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", borderRadius: 16, padding: 14,
    marginBottom: 14, borderLeftWidth: 4, borderLeftColor: "#9D1B00",
    elevation: 2, shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  etaTitle: { fontSize: 13, fontWeight: "700", color: "#1E1E1E" },
  etaSub: { fontSize: 13, color: "#64748B", marginTop: 1 },
  etaBadge: {
    backgroundColor: "#DCFCE7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  etaBadgeTxt: { fontSize: 12, fontWeight: "700", color: "#166534" },

  continueBtn: {
    backgroundColor: "#9D1B00", flexDirection: "row",
    alignItems: "center", justifyContent: "center",
    paddingVertical: 15, borderRadius: 16, gap: 10,
    elevation: 5, shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    marginBottom: 12,
  },
  continueTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },

  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 13, borderRadius: 16, gap: 8,
    borderWidth: 1.5, borderColor: "#9D1B00", backgroundColor: "#fff",
  },
  homeBtnTxt: { color: "#9D1B00", fontSize: 15, fontWeight: "700" },
});