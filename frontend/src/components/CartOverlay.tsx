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
    console.log("Placing order");
    clearCart();
    onClose();
  };

  return (
    <section
      data-testid="cart-overlay"
      className="fixed z-50 bg-white shadow-lg top-0 right-0 w-full sm:w-96 sm:right-4 md:right-8 lg:right-12 py-6 px-4 overflow-y-auto"
      style={{
        top: "var(--header-height, 58px)",
        height: "calc100vh - var(--header-height, 60px))",
        maxHeight: "calc(100vh - var(--header-height, 60px))",
      }}
    >
      <h2 className="mb-6">
        <span className="font-bold">My Bag</span>, {cartItems.length} items
      </h2>
      <div className="py-4 space-y-8 overflow-y-auto max-h-80">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
                data-testid="cart-item"
              >
                <div className="w-3/6">
                  <h2 className="capitalize font-light text-lg">{item.name}</h2>
                  <div className="my-2 font-bold">${item.price.toFixed(2)}</div>
                  {/* Placeholder for attributes */}
                  <div
                    className="mt-4"
                    data-testid={`cart-item-attribute-${item.id}`}
                  >
                    {/* Add attribute rendering here */}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between w-1/6">
                  <button
                    type="button"
                    className="flex items-center justify-center w-6 h-6 transition-colors border border-text hover:bg-text hover:text-white"
                    data-testid="cart-item-amount-increase"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <span data-testid="cart-item-amount">{item.quantity}</span>
                  <button
                    type="button"
                    className="flex items-center justify-center w-6 h-6 transition-colors border border-text hover:bg-text hover:text-white"
                    data-testid="cart-item-amount-decrease"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                </div>
                <div className="w-2/6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="pt-4 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold font-roboto">Total</h3>
          <div className="font-bold" data-testid="cart-total">
            ${getTotalPrice().toFixed(2)}
          </div>
        </div>
        <button
          type="button"
          className="btn-cta flex items-center justify-center disabled:opacity-70 w-full mt-8"
          data-testid="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
      </div>
    </section>
  );
};

export default CartOverlay;
