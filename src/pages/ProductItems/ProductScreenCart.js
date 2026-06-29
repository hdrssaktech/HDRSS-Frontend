// screens/CartScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Alert,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
const isTablet = width > 768;
const isSmallDevice = width < 380;

// Responsive sizing
const responsive = {
  // Header
  headerPaddingTop: Platform.OS === "ios" ? (isTablet ? 20 : 10) : (isTablet ? 30 : 20),
  headerPaddingBottom: isTablet ? 20 : 16,
  headerPaddingHorizontal: isTablet ? 30 : 20,
  headerTitleSize: isTablet ? 26 : 20,
  
  // Cart items
  itemImageSize: isTablet ? 100 : 80,
  itemPadding: isTablet ? 18 : 14,
  itemNameSize: isTablet ? 17 : 15,
  itemPriceSize: isTablet ? 19 : 17,
  
  // Quantity buttons
  quantityBtnSize: isTablet ? 36 : 30,
  quantityTextSize: isTablet ? 18 : 16,
  
  // Bottom container
  bottomPadding: isTablet ? 24 : 16,
  bottomPaddingBottom: Platform.OS === "ios" ? (isTablet ? 40 : 30) : (isTablet ? 24 : 16),
  
  // Empty state
  emptyIconSize: isTablet ? 120 : 80,
  emptyTextSize: isTablet ? 24 : 20,
  emptySubTextSize: isTablet ? 16 : 14,
  
  // Buttons
  checkoutBtnPadding: isTablet ? 18 : 16,
  checkoutBtnTextSize: isTablet ? 19 : 17,
};

export default function CartScreen({ navigation, route }) {
  const { cartItems: initialCartItems, onUpdateCart } = route.params || {};
  const [cartItems, setCartItems] = useState(initialCartItems || []);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) || 0) * item.quantity;
    }, 0);
    setTotalAmount(total);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    if (onUpdateCart) onUpdateCart(updatedItems);
  };

  const removeItem = (itemId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            if (onUpdateCart) onUpdateCart(updatedItems);
          }
        }
      ]
    );
  };

  const clearCart = () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => {
            setCartItems([]);
            if (onUpdateCart) onUpdateCart([]);
          }
        }
      ]
    );
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before proceeding.");
      return;
    }
    navigation.navigate("CheckoutScreen", {
      items: cartItems,
      totalAmount: totalAmount,
      onClearCart: () => {
        setCartItems([]);
        if (onUpdateCart) onUpdateCart([]);
      }
    });
  };

  const renderCartItem = ({ item }) => (
    <View style={[styles.cartItem, { padding: responsive.itemPadding }]}>
      <Image 
        source={{ uri: item.image || "https://via.placeholder.com/100" }}
        style={[styles.itemImage, { 
          width: responsive.itemImageSize, 
          height: responsive.itemImageSize 
        }]}
        resizeMode="cover"
      />
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { fontSize: responsive.itemNameSize }]} numberOfLines={2}>
          {item.productName || "Product"}
        </Text>
        <Text style={[styles.itemPrice, { fontSize: responsive.itemPriceSize }]}>
          ₹{item.price || "0.00"}
        </Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityBtn, { 
              width: responsive.quantityBtnSize, 
              height: responsive.quantityBtnSize,
              borderRadius: responsive.quantityBtnSize / 2,
            }]}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={isTablet ? 20 : 18} color="#8B1A1A" />
          </TouchableOpacity>
          
          <Text style={[styles.quantityText, { fontSize: responsive.quantityTextSize }]}>
            {item.quantity}
          </Text>
          
          <TouchableOpacity 
            style={[styles.quantityBtn, { 
              width: responsive.quantityBtnSize, 
              height: responsive.quantityBtnSize,
              borderRadius: responsive.quantityBtnSize / 2,
            }]}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={isTablet ? 20 : 18} color="#8B1A1A" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons name="trash-outline" size={isTablet ? 26 : 22} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#9D1B00" barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.headerContainer, {
        paddingTop: responsive.headerPaddingTop,
        paddingBottom: responsive.headerPaddingBottom,
        paddingHorizontal: responsive.headerPaddingHorizontal,
      }]}>
        <TouchableOpacity 
          style={[styles.backButton, { 
            width: isTablet ? 50 : 40, 
            height: isTablet ? 50 : 40,
            borderRadius: isTablet ? 25 : 20,
          }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { fontSize: responsive.headerTitleSize }]}>
          My Cart
        </Text>
        
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={[styles.clearText, { fontSize: isTablet ? 17 : 16 }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={responsive.emptyIconSize} color="#CBD5E1" />
          <Text style={[styles.emptyText, { fontSize: responsive.emptyTextSize }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubText, { fontSize: responsive.emptySubTextSize }]}>
            Browse products and add items you like
          </Text>
          <TouchableOpacity 
            style={[styles.shopBtn, { 
              paddingVertical: isTablet ? 16 : 14,
              paddingHorizontal: isTablet ? 40 : 32,
            }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.shopBtnText, { fontSize: isTablet ? 18 : 16 }]}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={[styles.listContainer, { 
              paddingBottom: isTablet ? 160 : 120 
            }]}
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Summary */}
          <View style={[styles.bottomContainer, {
            paddingHorizontal: responsive.headerPaddingHorizontal,
            paddingTop: responsive.bottomPadding,
            paddingBottom: responsive.bottomPaddingBottom,
          }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { fontSize: isTablet ? 17 : 15 }]}>
                Total Items
              </Text>
              <Text style={[styles.summaryValue, { fontSize: isTablet ? 17 : 15 }]}>
                {totalItems}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { fontSize: isTablet ? 17 : 15 }]}>
                Total Amount
              </Text>
              <Text style={[styles.totalAmount, { fontSize: isTablet ? 24 : 20 }]}>
                ₹{totalAmount.toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.checkoutBtn, { 
                paddingVertical: responsive.checkoutBtnPadding,
                borderRadius: isTablet ? 16 : 14,
              }]}
              onPress={proceedToCheckout}
            >
              <Text style={[styles.checkoutBtnText, { fontSize: responsive.checkoutBtnTextSize }]}>
                Proceed to Checkout
              </Text>
              <Ionicons name="arrow-forward" size={isTablet ? 22 : 20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    backgroundColor: "#9D1B00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: isTablet ? 30 : 25,
    borderBottomRightRadius: isTablet ? 30 : 25,
    elevation: 5,
    shadowColor: "#8B1A1A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  clearText: {
    color: "#FCA5A5",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 16,
  },
  emptySubText: {
    color: "#94A3B8",
    marginTop: 8,
    textAlign: "center",
  },
  shopBtn: {
    marginTop: 24,
    backgroundColor: "#9D1B00",
    borderRadius: 12,
    elevation: 3,
  },
  shopBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContainer: {
    padding: isTablet ? 20 : 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: isTablet ? 18 : 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemImage: {
    borderRadius: isTablet ? 14 : 12,
    backgroundColor: "#F1F5F9",
  },
  itemDetails: {
    flex: 1,
    marginLeft: isTablet ? 16 : 14,
    justifyContent: "space-between",
  },
  itemName: {
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  itemPrice: {
    fontWeight: "bold",
    color: "#9D1B00",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  quantityBtn: {
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  quantityText: {
    fontWeight: "600",
    color: "#0F172A",
    marginHorizontal: isTablet ? 16 : 14,
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    justifyContent: "center",
    paddingHorizontal: isTablet ? 12 : 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    color: "#64748B",
  },
  summaryValue: {
    fontWeight: "600",
    color: "#0F172A",
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#9D1B00",
  },
  checkoutBtn: {
    backgroundColor: "#9D1B00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    elevation: 4,
    shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: 10,
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});