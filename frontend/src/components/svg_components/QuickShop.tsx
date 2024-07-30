import React, { useContext } from "react";
import cartIcon from "../../assets/images/cart.svg";
import { CartContext } from "../../context/CartContext";

interface QuickShopProps {
  className?: string;
  product: Product;
}

const QuickShop: React.FC<QuickShopProps> = ({ className = "", product }) => {
  const { addToCart } = useContext(CartContext);

  const getDefaultAttributes = (product: Product) => {
    const defaultAttributes: Record<string, string> = {};
    if (product.attributes && Array.isArray(product.attributes)) {
      const attributeGroups: Record<string, any[]> = {};

      // Group attributes by attribute_id
      product.attributes.forEach((attr) => {
        if (attr && attr.attribute_id) {
          if (!attributeGroups[attr.attribute_id]) {
            attributeGroups[attr.attribute_id] = [];
          }
          attributeGroups[attr.attribute_id].push(attr);
        }
      });

      // Select the first attribute from each group
      Object.entries(attributeGroups).forEach(([attribute_id, attrs]) => {
        if (attrs.length > 0 && attrs[0].value) {
          defaultAttributes[attribute_id] = attrs[0].value;
        } else {
          console.warn(`No valid attributes found for ${attribute_id}`);
        }
      });
    } else {
      console.warn("Product has no attributes or attributes is not an array");
    }
    return defaultAttributes;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultAttributes = getDefaultAttributes(product);

    const cartItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      price: parseFloat(product.prices[0].amount),
      currency: product.prices[0].currency.symbol,
      attributes: defaultAttributes,
      image: product.gallery[0],
    };

    console.log("Adding to cart from QuickShop:", cartItem);
    addToCart(cartItem);
  };

  return (
    <button
      data-testid="quick-shop-btn"
      className={`${className} flex items-center justify-center`}
      onClick={handleClick}
    >
      <img src={cartIcon} alt="Quick Shop" className="w-6 h-6" />
    </button>
  );
};

export default QuickShop;
