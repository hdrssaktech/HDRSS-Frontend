// screens/OrderConfirmationScreen.js  (route name: ProductScreenOrderConfirm)
import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Platform, SafeAreaView, Dimensions, ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");
const isTablet = width > 600;

const C = {
  green: "#1B6B3A",
  greenDeep: "#134F2B",
  greenSoft: "#E8F5EC",
  primary: "#8B1A1A",
  primarySoft: "#FDEDED",
  gold: "#B8862E",
  bg: "#F7F3F0",
  surface: "#FFFFFF",
  textDark: "#1A0A0A",
  textMid: "#5C3A3A",
  textLight: "#9E7070",
  border: "#EDE0DC",
  divider: "#F1EAE7",
};

const PAYMENT_LABELS = {
  gpay: "Google Pay",
  phonepe: "PhonePe",
  upi: "UPI",
  card: "Card",
  cod: "Cash on Delivery",
};

const TRACKER_STEPS = ["Confirmed", "Packed", "Shipped", "Delivered"];

export default function ProductScreenOrderConfirm({ navigation, route }) {
  const { orders } = useCart();
  // fall back to the most recent order in context if this screen is opened
  // without params (e.g. reopened from the Orders list)
  const orderDetails = route.params?.orderDetails || orders[0];
  const [showItems, setShowItems] = useState(true);

  const fmt = (p) => parseFloat(p || 0).toFixed(2);
  const payLabel = PAYMENT_LABELS[orderDetails?.paymentMethod] || "Online";
  const isCOD = orderDetails?.paymentMethod === "cod";

  if (!orderDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="receipt-outline" size={40} color={C.primary} />
          </View>
          <Text style={styles.emptyTitle}>No order to show</Text>
          <Text style={styles.emptySub}>We couldn't find any recent order details.</Text>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.homeBtnTxt}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={C.greenDeep} barStyle="light-content" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.checkCircleOuter}>
          <View style={styles.checkCircleInner}>
            <Ionicons name="checkmark" size={30} color={C.green} />
          </View>
        </View>
        <Text style={styles.headerTitle}>Order Confirmed</Text>
        <Text style={styles.headerSub}>
          {isCOD ? "Pay cash on delivery when it arrives" : "Payment received successfully"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.thankYou}>
          Thanks, {orderDetails?.customerInfo?.name?.split(" ")[0] || "there"} 🎉
        </Text>

        {/* ── DELIVERY TRACKER ── */}
        <View style={styles.trackerCard}>
          <View style={styles.trackerRow}>
            {TRACKER_STEPS.map((step, i) => {
              const active = i === 0; // order just placed → first step active
              const isLast = i === TRACKER_STEPS.length - 1;
              return (
                <React.Fragment key={step}>
                  <View style={styles.trackerStep}>
                    <View style={[styles.trackerDot, active && styles.trackerDotActive]}>
                      {active && <View style={styles.trackerDotCore} />}
                    </View>
                    <Text style={[styles.trackerLabel, active && styles.trackerLabelActive]}>
                      {step}
                    </Text>
                  </View>
                  {!isLast && <View style={styles.trackerLine} />}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* ── ORDER SUMMARY (receipt style) ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBadge}>
              <Ionicons name="receipt-outline" size={16} color={C.primary} />
            </View>
            <Text style={styles.cardTitle}>Order Summary</Text>
          </View>

          <InfoRow label="Order ID" value={orderDetails?.orderId || "—"} mono />
          <InfoRow
            label="Date"
            value={
              orderDetails?.orderDate
                ? new Date(orderDetails.orderDate).toLocaleString("en-IN", {
                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })
                : "—"
            }
          />
          <InfoRow label="Payment Method" value={payLabel} />
          <InfoRow
            label="Status"
            value={isCOD ? "Confirmed" : "Paid"}
            pill
          />

          <View style={styles.receiptDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{fmt(orderDetails?.totalAmount)}</Text>
          </View>
        </View>

        {/* ── DELIVERY ADDRESS ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBadge}>
              <Ionicons name="location-outline" size={16} color={C.primary} />
            </View>
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>

          <Text style={styles.deliveryName}>{orderDetails?.customerInfo?.name || "—"}</Text>
          <Text style={styles.deliveryLine}>{orderDetails?.customerInfo?.address || "—"}</Text>
          <Text style={styles.deliveryLine}>
            {orderDetails?.customerInfo?.city} — {orderDetails?.customerInfo?.pincode}
          </Text>

          <View style={styles.phoneChip}>
            <Ionicons name="call-outline" size={13} color={C.primary} />
            <Text style={styles.phoneChipTxt}>{orderDetails?.customerInfo?.phone || "—"}</Text>
          </View>
        </View>

        {/* ── ITEMS ── */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => setShowItems((p) => !p)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="bag-outline" size={16} color={C.primary} />
              </View>
              <Text style={styles.cardTitle}>
                Items Ordered <Text style={styles.itemCountText}>({orderDetails?.items?.length || 0})</Text>
              </Text>
            </View>
            <Ionicons name={showItems ? "chevron-up" : "chevron-down"} size={18} color={C.textLight} />
          </TouchableOpacity>

          {showItems && (
            <View>
              {(orderDetails?.items || []).map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <View style={styles.itemQtyBadge}>
                    <Text style={styles.itemQtyBadgeTxt}>{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemRowName} numberOfLines={1}>{item.productName || "Product"}</Text>
                  <Text style={styles.itemRowPrice}>
                    ₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.receiptDivider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{fmt(orderDetails?.totalAmount)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── ETA BANNER ── */}
        <View style={styles.etaBanner}>
          <View style={styles.etaIconWrap}>
            <Ionicons name="time-outline" size={20} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.etaTitle}>Estimated Delivery</Text>
            <Text style={styles.etaSub}>3 – 5 business days</Text>
          </View>
          <View style={styles.etaBadge}>
            <View style={styles.etaBadgeDot} />
            <Text style={styles.etaBadgeTxt}>On Track</Text>
          </View>
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* ── STICKY FOOTER ACTIONS ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeBtnFooter}
          onPress={() => navigation.popToTop()}
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={18} color={C.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate("ProductScreen1fullproducts")}
          activeOpacity={0.9}
        >
          <Text style={styles.continueTxt}>Continue Shopping</Text>
          <Ionicons name="arrow-forward" size={19} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, mono, valueStyle, pill }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {pill ? (
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusPillText, valueStyle]}>{value}</Text>
        </View>
      ) : (
        <Text style={[styles.infoVal, mono && styles.mono, valueStyle]}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  /* ── HEADER ── */
  header: {
    backgroundColor: C.green,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 8 : 22,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: C.greenDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  checkCircleOuter: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
    marginTop: 30,
  },
  checkCircleInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: isTablet ? 22 : 19, fontWeight: "800", letterSpacing: 0.2 },
  headerSub: { color: "rgba(255,255,255,0.82)", fontSize: 13, marginTop: 4, textAlign: "center" },

  scroll: { padding: 16, paddingBottom: 24 },

  thankYou: { fontSize: isTablet ? 20 : 17, fontWeight: "800", color: C.textDark, marginBottom: 14 },

  /* ── TRACKER ── */
  trackerCard: {
    backgroundColor: C.surface, borderRadius: 18, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  trackerRow: { flexDirection: "row", alignItems: "flex-start" },
  trackerStep: { alignItems: "center", width: 62 },
  trackerDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: "#F1E4E4", justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#F1E4E4",
  },
  trackerDotActive: { backgroundColor: C.greenSoft, borderColor: C.green },
  trackerDotCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green },
  trackerLine: { flex: 1, height: 2, backgroundColor: "#F1E4E4", marginTop: 9, marginHorizontal: -6 },
  trackerLabel: { fontSize: 10.5, color: C.textLight, marginTop: 6, fontWeight: "600", textAlign: "center" },
  trackerLabelActive: { color: C.green, fontWeight: "800" },

  /* ── CARDS ── */
  card: {
    backgroundColor: C.surface, borderRadius: 18, padding: 16, marginBottom: 14,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
    borderWidth: 1, borderColor: C.border,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  cardIconBadge: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.primarySoft, justifyContent: "center", alignItems: "center",
  },
  cardTitle: { fontSize: 14.5, fontWeight: "700", color: C.textDark },
  itemCountText: { color: C.textLight, fontWeight: "600" },

  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.divider,
  },
  infoLabel: { fontSize: 13, color: C.textLight, fontWeight: "500" },
  infoVal: { fontSize: 13.5, fontWeight: "700", color: C.textDark, maxWidth: "60%", textAlign: "right" },
  mono: { fontFamily: Platform.OS === "ios" ? "Courier" : "monospace", fontSize: 12.5, letterSpacing: 0.3 },

  statusPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#EAF8EE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1F9D4A" },
  statusPillText: { color: "#1F9D4A", fontSize: 12, fontWeight: "700" },

  receiptDivider: {
    height: 1, backgroundColor: C.divider, marginTop: 4, marginBottom: 10,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 14.5, fontWeight: "700", color: C.textDark },
  totalValue: { fontSize: 19, fontWeight: "900", color: C.primary },

  /* ── ADDRESS ── */
  deliveryName: { fontSize: 15, fontWeight: "700", color: C.textDark, marginBottom: 4 },
  deliveryLine: { fontSize: 13, color: C.textMid, lineHeight: 20, marginBottom: 2 },
  phoneChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.primarySoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    alignSelf: "flex-start", marginTop: 8,
  },
  phoneChipTxt: { fontSize: 12.5, fontWeight: "700", color: C.primary },

  /* ── ITEMS ── */
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  itemQtyBadge: {
    width: 24, height: 24, borderRadius: 7,
    backgroundColor: C.primarySoft, justifyContent: "center", alignItems: "center",
  },
  itemQtyBadgeTxt: { fontSize: 11.5, fontWeight: "800", color: C.primary },
  itemRowName: { flex: 1, fontSize: 13, color: C.textMid, fontWeight: "600" },
  itemRowPrice: { fontSize: 13.5, fontWeight: "800", color: C.textDark },

  /* ── ETA ── */
  etaBanner: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 4,
    borderLeftWidth: 4, borderLeftColor: C.primary,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  etaIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.primarySoft, justifyContent: "center", alignItems: "center",
  },
  etaTitle: { fontSize: 13, fontWeight: "700", color: C.textDark },
  etaSub: { fontSize: 12.5, color: C.textLight, marginTop: 1 },
  etaBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#DCFCE7", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  etaBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#166534" },
  etaBadgeTxt: { fontSize: 11.5, fontWeight: "700", color: "#166534" },

  /* ── STICKY FOOTER ── */
  footer: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    backgroundColor: C.surface,
    borderTopWidth: 1, borderTopColor: C.border,
  },
  homeBtnFooter: {
    width: 50, height: 50, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.primary, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
  },
  continueBtn: {
    flex: 1,
    backgroundColor: C.primary, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 15, borderRadius: 14, gap: 10,
    elevation: 5, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
  },
  continueTxt: { color: "#fff", fontSize: 15.5, fontWeight: "700" },

  /* ── EMPTY STATE ── */
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 30 },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.primarySoft, justifyContent: "center", alignItems: "center", marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: C.textDark },
  emptySub: { fontSize: 13, color: C.textLight, textAlign: "center", marginBottom: 10 },
  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 13, paddingHorizontal: 28, borderRadius: 14, gap: 8,
    borderWidth: 1.5, borderColor: C.primary, backgroundColor: "#fff",
  },
  homeBtnTxt: { color: C.primary, fontSize: 15, fontWeight: "700" },
});