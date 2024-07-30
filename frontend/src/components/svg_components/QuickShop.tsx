// QuickShop.tsx
import React from "react";
import cartIcon from "../../assets/images/cart.svg";

interface QuickShopProps {
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

class QuickShop extends React.Component<QuickShopProps> {
  render() {
    const { className = "", onClick } = this.props;

    return (
      <button
        data-testid="quick-shop-btn"
        className={`${className} flex items-center justify-center`}
        onClick={onClick}
      >
        <img src={cartIcon} alt="Quick Shop" className="w-6 h-6" />
      </button>
    );
  }
}

export default QuickShop;
