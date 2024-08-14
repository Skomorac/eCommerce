import React from "react";

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

export const CartContext = React.createContext<CartContextType | undefined>(
  undefined
);
export type { CartContextType };

const CART_STORAGE_KEY = "scandiwebCart";

interface CartProviderState {
  cartItems: CartItem[];
}

export class CartProvider extends React.Component<
  { children: React.ReactNode },
  CartProviderState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    this.state = {
      cartItems: savedCart ? JSON.parse(savedCart) : [],
    };
  }

  componentDidUpdate(
    prevProps: Readonly<{ children: React.ReactNode }>,
    prevState: Readonly<CartProviderState>
  ) {
    if (prevState.cartItems !== this.state.cartItems) {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(this.state.cartItems)
      );
    }
  }

  addToCart = (newItem: CartItem) => {
    this.setState((prevState) => {
      const existingItemIndex = prevState.cartItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.attributes) === JSON.stringify(newItem.attributes)
      );

      if (existingItemIndex > -1) {
        const updatedCartItems = prevState.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
        return { cartItems: updatedCartItems };
      } else {
        return { cartItems: [...prevState.cartItems, newItem] };
      }
    });
  };

  removeFromCart = (
    id: string,
    attributes: { [key: string]: AttributeValue }
  ) => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.filter(
        (item) =>
          !(
            item.id === id &&
            JSON.stringify(item.attributes) === JSON.stringify(attributes)
          )
      ),
    }));
  };

  updateQuantity = (
    id: string,
    attributes: { [key: string]: AttributeValue },
    quantity: number
  ) => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.map((item) =>
        item.id === id &&
        JSON.stringify(item.attributes) === JSON.stringify(attributes)
          ? { ...item, quantity }
          : item
      ),
    }));
  };

  clearCart = () => {
    this.setState({ cartItems: [] });
  };

  getTotalItems = () => {
    return this.state.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  getTotalPrice = () => {
    return this.state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  render() {
    const value: CartContextType = {
      cartItems: this.state.cartItems,
      addToCart: this.addToCart,
      removeFromCart: this.removeFromCart,
      updateQuantity: this.updateQuantity,
      clearCart: this.clearCart,
      getTotalItems: this.getTotalItems,
      getTotalPrice: this.getTotalPrice,
    };

    return (
      <CartContext.Provider value={value}>
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
