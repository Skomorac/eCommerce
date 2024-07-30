import React, { useState, useEffect, ReactNode, FC } from "react";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  attributes: Record<string, string>; // Attribute selections
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartItemsCount: number;
  totalAmount: number;
  incrementCartCount: () => void;
  addToCart: (item: CartItem) => void;
  updateCartItem: (
    id: string,
    attributes: Record<string, string>,
    quantity: number
  ) => void;
  removeCartItem: (id: string, attributes: Record<string, string>) => void;
}

export const CartContext = React.createContext<CartContextType>({
  cartItems: [],
  cartItemsCount: 0,
  totalAmount: 0,
  incrementCartCount: () => {},
  addToCart: () => {},
  updateCartItem: () => {},
  removeCartItem: () => {},
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartItemsCount(count);

    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  }, [cartItems]);

  const incrementCartCount = () => {
    setCartItemsCount((prevCount) => prevCount + 1);
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) =>
          i.id === item.id &&
          JSON.stringify(i.attributes) === JSON.stringify(item.attributes)
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      }
      return [...prevItems, item];
    });
  };

  const updateCartItem = (
    id: string,
    attributes: Record<string, string>,
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

  const removeCartItem = (id: string, attributes: Record<string, string>) => {
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        totalAmount,
        incrementCartCount,
        addToCart,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
