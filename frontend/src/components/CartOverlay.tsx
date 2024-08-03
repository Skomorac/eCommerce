import React from "react";
import { useCart } from "../context/CartContext";

const CartOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
    <div className="cart-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-md p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
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
                <div>
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200"
                      data-testid="cart-item-amount-decrease"
                    >
                      -
                    </button>
                    <span className="mx-2" data-testid="cart-item-amount">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200"
                      data-testid="cart-item-amount-increase"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-auto text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="mt-4">
              <p className="font-bold" data-testid="cart-total">
                Total: ${getTotalPrice().toFixed(2)}
              </p>
              <button
                onClick={handlePlaceOrder}
                className="mt-4 w-full bg-primary text-white py-2 px-4 rounded"
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </>
        )}
        <button onClick={onClose} className="mt-4 text-gray-500">
          Close
        </button>
      </div>
    </div>
  );
};

export default CartOverlay;
