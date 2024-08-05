// src/context/CartContext.tsx

import React, { createContext, useState, useContext } from "react";

interface AttributeValue {
  value: string;
  displayValue: string;
}

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  attributes: { [key: string]: AttributeValue };
  allAttributes: Attribute[];
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (
    id: string,
    attributes: { [key: string]: AttributeValue }
  ) => void;
  updateQuantity: (
    id: string,
    attributes: { [key: string]: AttributeValue },
    quantity: number
  ) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.attributes) === JSON.stringify(newItem.attributes)
      );

      if (existingItemIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (
    id: string,
    attributes: { [key: string]: AttributeValue }
  ) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id === id &&
            JSON.stringify(item.attributes) === JSON.stringify(attributes)
          )
      )
    );
  };

  const updateQuantity = (
    id: string,
    attributes: { [key: string]: AttributeValue },
    quantity: number
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id &&
        JSON.stringify(item.attributes) === JSON.stringify(attributes)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
