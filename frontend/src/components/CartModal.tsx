import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

interface CartModalProps {
  onClose: () => void;
}

const toggleBodyScroll = (disable: boolean) => {
  if (disable) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }
};

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const { cartItems, totalAmount, updateCartItem, removeCartItem } =
    useContext(CartContext);

  React.useEffect(() => {
    toggleBodyScroll(true);
    return () => toggleBodyScroll(false);
  }, []);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 top-28 bg-gray-800 bg-opacity-50 z-40"
        onClick={handleOverlayClick}
      ></div>
      <div
        className="fixed right-10 top-28 h-1/2 bg-white w-full md:w-96 lg:w-1/4 z-50 p-6 shadow-lg overflow-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold mb-4">
          My Bag, {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
        </h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={`${item.id}-${JSON.stringify(item.attributes)}`}
                className="flex items-center border border-gray-200 p-4 rounded-lg"
              >
                {/* Left group: title, price, and attributes */}
                <div className="flex flex-col w-1/2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-lg font-bold mt-2">
                    {item.currency}
                    {item.price.toFixed(2)}
                  </p>
                  {Object.entries(item.attributes).map(([key, value]) => (
                    <div key={key} className="mt-2">
                      <h4 className="text-sm font-semibold">{key}:</h4>
                      <div className="flex flex-wrap mt-1">
                        {key.toLowerCase() === "color" ? (
                          <div
                            className="w-6 h-6 border border-gray-300"
                            style={{ backgroundColor: value as string }}
                          ></div>
                        ) : (
                          <span className="mr-2 mb-1 px-2 py-1 text-sm border rounded">
                            {value as string}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Middle group: count buttons */}
                <div className="flex flex-col items-center justify-center w-1/6">
                  <button
                    onClick={() =>
                      updateCartItem(
                        item.id,
                        item.attributes,
                        item.quantity + 1
                      )
                    }
                    className="text-2xl font-bold w-8 h-8 flex items-center justify-center border border-black"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <span className="my-2 text-lg">{item.quantity}</span>
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateCartItem(
                          item.id,
                          item.attributes,
                          item.quantity - 1
                        );
                      } else {
                        removeCartItem(item.id, item.attributes);
                      }
                    }}
                    className="text-2xl font-bold w-8 h-8 flex items-center justify-center border border-black"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                </div>

                {/* Right group: image */}
                <div className="w-1/2 flex justify-end">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-40 h-40 object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8">
          <div className="flex justify-between items-center text-xl font-semibold mb-4">
            <span>Total</span>
            <span>
              {cartItems[0]?.currency}
              {totalAmount.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => {
              // Perform the GraphQL mutation here
              onClose();
            }}
            className={`
              w-full py-3 text-lg font-semibold text-white
              ${
                cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }
            `}
            disabled={cartItems.length === 0}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </>
  );
};

export default CartModal;
