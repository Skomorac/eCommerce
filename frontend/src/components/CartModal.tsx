import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

interface CartModalProps {
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const { cartItems, totalAmount, updateCartItem, removeCartItem } =
    useContext(CartContext);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the click from propagating to the modal container
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
        className="fixed right-10 top-28 h-1/2 bg-white w-full md:w-96 lg:w-1/5 z-50 p-6 shadow-lg overflow-auto"
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
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="py-4 flex justify-between items-start"
              >
                <div className="flex items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {Object.entries(item.attributes).map(([key, value]) => (
                        <span key={key}>
                          {key}: {value}{" "}
                        </span>
                      ))}
                    </p>
                    <p className="text-sm">
                      {item.currency}
                      {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateCartItem(item.id, item.quantity - 1);
                          } else {
                            removeCartItem(item.id);
                          }
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Decrease quantity"
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
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartItem(item.id, item.quantity + 1)
                        }
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Increase quantity"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <p className="text-lg font-semibold">
            Total: {totalAmount.toFixed(2)}
          </p>
          <button
            onClick={() => {
              // Perform the GraphQL mutation here
              onClose();
            }}
            className={`${
              cartItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white w-full py-2 rounded-lg mt-4`}
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default CartModal;
