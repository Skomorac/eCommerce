import React from "react";
import { useCart } from "../context/CartContext";

interface CartOverlayProps {
  onClose: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();

  const handlePlaceOrder = () => {
    // Implement order placement logic here
    console.log("Placing order");
    clearCart();
    onClose();
  };

  return (
    <div
      data-testid="cart-overlay"
      className="fixed right-0 mr-28 w-96 bg-white shadow-lg z-50 overflow-y-auto"
      style={{
        top: "var(--header-height, 60px)",
        height: "calc(60vh - var(--header-height, 60px))",
        overflowY: "auto",
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item mb-4 flex items-center"
                data-testid="cart-item"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                      data-testid="cart-item-amount-decrease"
                    >
                      -
                    </button>
                    <span className="mx-2" data-testid="cart-item-amount">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                      data-testid="cart-item-amount-increase"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="mt-6">
              <p className="font-bold text-xl" data-testid="cart-total">
                Total: ${getTotalPrice().toFixed(2)}
              </p>
              <button
                onClick={handlePlaceOrder}
                className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-200"
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartOverlay;
