// components/HeaderCartOrders.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");
const isTablet = width > 600;

export default function HeaderCartOrders({ navigation, iconColor = "#fff", iconSize }) {
  const { cartCount, orders } = useCart();
  const [ordersVisible, setOrdersVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const size = iconSize || (isTablet ? 24 : 20);

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.iconBtn} onPress={() => setOrdersVisible(true)}>
        <Ionicons name="receipt-outline" size={size} color={iconColor} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconBtn, { marginLeft: 8 }]}
        onPress={() => navigation.navigate("ProductScreenCart")}
      >
        <Ionicons name="cart" size={size} color={iconColor} />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={ordersVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOrdersVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOrdersVisible(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>My Orders</Text>
            <TouchableOpacity onPress={() => setOrdersVisible(false)}>
              <Ionicons name="close" size={isTablet ? 26 : 22} color="#5C3A3A" />
            </TouchableOpacity>
          </View>

          {orders.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="receipt-outline" size={isTablet ? 60 : 48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySub}>Your placed orders will show up here</Text>
            </View>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(o) => o.orderId}
              style={{ maxHeight: 420 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const expanded = expandedId === item.orderId;
                return (
                  <TouchableOpacity
                    style={styles.orderCard}
                    activeOpacity={0.8}
                    onPress={() => setExpandedId(expanded ? null : item.orderId)}
                  >
                    <View style={styles.orderTopRow}>
                      <Text style={styles.orderId}>{item.orderId}</Text>
                      <Text style={styles.orderAmt}>₹{parseFloat(item.totalAmount || 0).toFixed(2)}</Text>
                    </View>
                    <Text style={styles.orderMeta}>
                      {new Date(item.orderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {"  •  "}
                      {item.items?.length || 0} item{item.items?.length !== 1 ? "s" : ""}
                    </Text>
                    {expanded && (
                      <View style={styles.orderItems}>
                        {(item.items || []).map((p, i) => (
                          <View key={i} style={styles.orderItemRow}>
                            <Text style={styles.orderItemName} numberOfLines={1}>
                              {p.productName || "Product"}
                            </Text>
                            <Text style={styles.orderItemQty}>×{p.quantity}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    width: isTablet ? 44 : 38,
    height: isTablet ? 44 : 38,
    borderRadius: isTablet ? 22 : 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#D4AF37",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#301913", fontSize: 10, fontWeight: "bold" },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: isTablet ? 24 : 18,
    paddingBottom: 30,
    paddingTop: 10,
    maxHeight: "80%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    marginBottom: 14,
  },
  sheetHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sheetTitle: { fontSize: isTablet ? 19 : 17, fontWeight: "700", color: "#1A0A0A" },

  emptyWrap: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#1A0A0A" },
  emptySub: { fontSize: 13, color: "#9E7070" },

  orderCard: {
    backgroundColor: "#FAF6F3",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EDE0DC",
  },
  orderTopRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  orderId: { fontSize: 13, fontWeight: "700", color: "#8B1A1A" },
  orderAmt: { fontSize: 14, fontWeight: "800", color: "#1A0A0A" },
  orderMeta: { fontSize: 12, color: "#9E7070" },
  orderItems: { marginTop: 8, borderTopWidth: 1, borderTopColor: "#EDE0DC", paddingTop: 8, gap: 4 },
  orderItemRow: { flexDirection: "row", justifyContent: "space-between" },
  orderItemName: { flex: 1, fontSize: 12, color: "#5C3A3A" },
  orderItemQty: { fontSize: 12, color: "#9E7070", marginLeft: 6 },
});