import React from "react";

interface CartContextType {
  cartItemsCount: number;
  incrementCartCount: () => void;
}

export const CartContext = React.createContext<CartContextType>({
  cartItemsCount: 0,
  incrementCartCount: () => {},
});
