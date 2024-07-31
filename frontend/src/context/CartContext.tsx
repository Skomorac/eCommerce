import React, { useState, useEffect, ReactNode, FC } from "react";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  attributes: Record<string, string>;
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
  clearCart: () => void;
}

export const CartContext = React.createContext<CartContextType>({
  cartItems: [],
  cartItemsCount: 0,
  totalAmount: 0,
  incrementCartCount: () => {},
  addToCart: () => {},
  updateCartItem: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
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
    console.log("Adding item to cart:", item);
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) =>
          i.id === item.id &&
          JSON.stringify(i.attributes) === JSON.stringify(item.attributes)
      );
      if (existingItemIndex > -1) {
        console.log("Updating existing item in cart");
        const updatedItems = prevItems.map((cartItem, index) => {
          if (index === existingItemIndex) {
            return { ...cartItem, quantity: cartItem.quantity + item.quantity };
          }
          return cartItem;
        });
        console.log("Updated cart items:", updatedItems);
        return updatedItems;
      }
      console.log("Adding new item to cart");
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

  const clearCart = () => {
    setCartItems([]);
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
