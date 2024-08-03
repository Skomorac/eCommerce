import React from "react";
import { useCart } from "../context/CartContext";
import { useMutation } from "@apollo/client";
import { PLACE_ORDER } from "../graphql/queries";

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

  const [placeOrder] = useMutation(PLACE_ORDER);

  const handlePlaceOrder = async () => {
    try {
      await placeOrder({
        variables: {
          OrderInput: {
            items: cartItems.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
              attributes: item.attributes,
            })),
          },
        },
      });
      clearCart();
      onClose();
    } catch (error) {
      console.error("Failed to place order", error);
    }
  };

  // Calculate the total number of items in the cart
  const totalItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <section
      data-testid="cart-overlay"
      className="fixed z-50 bg-white shadow-lg top-0 right-0 w-full sm:w-96 sm:right-4 md:right-8 lg:right-12 py-6 px-4 flex flex-col"
      style={{
        top: "var(--header-height, 58px)",
        height: "calc(60vh - var(--header-height, 60px))",
      }}
    >
      <div className="flex-shrink-0 mb-6">
        <h2>
          <span className="font-bold">My Bag</span>, {totalItemsCount}{" "}
          {totalItemsCount === 1 ? "Item" : "Items"}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
                data-testid="cart-item"
              >
                <div className="w-3/6">
                  <h2 className="capitalize font-light text-lg">{item.name}</h2>
                  <div className="my-2 font-bold">${item.price.toFixed(2)}</div>
                  {/* Render attributes */}
                  {Object.entries(item.attributes).map(
                    ([attrName, attrValue]) => (
                      <div
                        key={attrName}
                        className="mt-2"
                        data-testid={`cart-item-attribute-${attrName}`}
                      >
                        <span className="font-semibold">{attrName}: </span>
                        <span
                          data-testid={`cart-item-attribute-${attrName}-${attrValue}${
                            attrValue === item.attributes[attrName]
                              ? "-selected"
                              : ""
                          }`}
                        >
                          {attrValue}
                        </span>
                      </div>
                    )
                  )}
                </div>
                <div className="flex flex-col items-center justify-between w-1/6">
                  <button
                    type="button"
                    className="flex items-center justify-center w-6 h-6 transition-colors border border-gray-500 hover:bg-gray-500 hover:text-white"
                    data-testid="cart-item-amount-increase"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.attributes,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                  <span data-testid="cart-item-amount">{item.quantity}</span>
                  <button
                    type="button"
                    className="flex items-center justify-center w-6 h-6 transition-colors border border-gray-500 hover:bg-gray-500 hover:text-white"
                    data-testid="cart-item-amount-decrease"
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item.id, item.attributes);
                      } else {
                        updateQuantity(
                          item.id,
                          item.attributes,
                          item.quantity - 1
                        );
                      }
                    }}
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
          </div>
        )}
      </div>
      <div className="flex-shrink-0 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Total</h3>
          <div className="font-bold" data-testid="cart-total">
            ${getTotalPrice().toFixed(2)}
          </div>
        </div>
        <button
          type="button"
          className="bg-primary text-white hover:bg-accent flex items-center justify-center disabled:opacity-70 w-full mt-8 py-3"
          data-testid="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          PLACE ORDER
        </button>
      </div>
    </section>
  );
};

export default CartOverlay;
