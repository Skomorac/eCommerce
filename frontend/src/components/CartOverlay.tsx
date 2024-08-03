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
      const totalAmount = getTotalPrice();
      const currency = "USD"; // Assuming USD, adjust if you have multiple currencies

      const orderInput = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          attributeValues: Object.entries(item.attributes).map(
            ([id, value]) => ({
              id,
              value,
            })
          ),
        })),
        totalAmount: totalAmount,
      };

      const result = await placeOrder({
        variables: { OrderInput: orderInput },
      });

      console.log("Order placed successfully:", result.data.placeOrder);
      clearCart();
      onClose();
    } catch (error) {
      console.error("Failed to place order", error);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((graphQLError) => {
          console.error("GraphQL error:", graphQLError);
        });
      }
      if (error.networkError) {
        console.error("Network error:", error.networkError);
      }
    }
  };

  const totalItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const renderAttributes = (attributes: Record<string, string>) => {
    return Object.entries(attributes).map(([attributeId, value]) => (
      <div
        key={attributeId}
        className="mt-2 flex flex-col"
        data-testid={`cart-item-attribute-${attributeId.toLowerCase()}`}
      >
        <span className="font-semibold mb-1">{attributeId}:</span>
        <div className="flex items-center">
          {attributeId.toLowerCase() === "color" ? (
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: value }}
              data-testid={`cart-item-attribute-${attributeId.toLowerCase()}-${value}-selected`}
            >
              <div className="w-full h-full rounded-full border-2 border-white"></div>
            </div>
          ) : (
            <div
              className="inline-block px-2 py-1 text-sm text-white bg-black"
              data-testid={`cart-item-attribute-${attributeId.toLowerCase()}-${value}-selected`}
            >
              {value}
            </div>
          )}
        </div>
      </div>
    ));
  };

  // Helper function to create a unique key for each cart item
  const createItemKey = (item: any) => {
    return `${item.id}-${JSON.stringify(item.attributes)}`;
  };

  return (
    <section
      data-testid="cart-overlay"
      className="fixed z-50 bg-white shadow-lg top-0 right-0 w-full sm:w-96 sm:right-4 md:right-8 lg:right-12 py-6 px-4 flex flex-col"
      style={{
        top: "var(--header-height, 58px)",
        height: "calc(80vh - var(--header-height, 60px))",
      }}
    >
      <div className="flex-shrink-0 mb-6">
        <h2>
          <span className="font-bold">My Bag</span>, {totalItemsCount}{" "}
          {totalItemsCount === 1 ? "item" : "items"}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={createItemKey(item)}
                className="flex justify-between p-4 border border-gray-200 rounded-lg shadow-sm"
                data-testid="cart-item"
              >
                <div className="w-3/6">
                  <h2 className="capitalize font-light text-lg">{item.name}</h2>
                  <div className="my-2 font-bold">${item.price.toFixed(2)}</div>
                  {renderAttributes(item.attributes)}
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
