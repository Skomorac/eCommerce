import React from "react";
import cartIcon from "../../assets/images/cart.svg";

interface CartProps {
  className?: string;
  buttonClassName?: string;
  imgClassName?: string;
  itemsCount: number;
  onClick?: () => void; // Add onClick prop
}

class Cart extends React.Component<CartProps> {
  render() {
    const {
      className = "",
      buttonClassName = "",
      imgClassName = "",
      itemsCount,
      onClick, // Destructure onClick prop
    } = this.props;

    return (
      <button
        data-testid="cart-btn"
        className={`${className} ${buttonClassName} relative`}
        onClick={onClick} // Use onClick prop
        aria-label="View cart" // Add aria-label for accessibility
      >
        <img
          src={cartIcon}
          alt="Shopping Cart"
          className={`w-6 h-6 ${imgClassName}`}
        />
        {itemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemsCount}
          </span>
        )}
      </button>
    );
  }
}

export default Cart;
