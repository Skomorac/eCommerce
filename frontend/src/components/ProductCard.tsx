import React, { useState } from "react";
import { Link } from "react-router-dom";
import cartIcon from "../assets/images/cart.svg";
import { useCart } from "../context/CartContext";

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  prices: {
    amount: string;
    currency: {
      symbol: string;
    };
  }[];
  attributes?: Attribute[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const mainImage = product.gallery[0] || "";
  const price = product.prices[0];

  const formatPrice = (amount: string, symbol: string) => {
    const numericAmount = parseFloat(amount);
    return isNaN(numericAmount)
      ? "N/A"
      : `${symbol}${numericAmount.toFixed(2)}`;
  };

  const getDefaultAttributes = (): Record<
    string,
    { value: string; displayValue: string }
  > => {
    const defaultAttrs: Record<
      string,
      { value: string; displayValue: string }
    > = {};
    if (product.attributes) {
      product.attributes.forEach((attr) => {
        if (!defaultAttrs[attr.attribute_id]) {
          defaultAttrs[attr.attribute_id] = {
            value: attr.value,
            displayValue: attr.displayValue,
          };
        }
      });
    }
    return defaultAttrs;
  };

  const handleQuickShop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inStock) {
      const defaultAttributes = getDefaultAttributes();
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.prices[0].amount),
        quantity: 1,
        attributes: defaultAttributes,
        image: product.gallery[0],
      });
      console.log(
        `Quick shop: Added ${product.name} to cart with attributes:`,
        defaultAttributes
      );
    } else {
      console.log(`Product ${product.name} is out of stock`);
    }
  };

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out 
                  ${isHovered ? "transform scale-105" : ""}
                  rounded-lg overflow-hidden shadow-md hover:shadow-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Link to={`/product/${product.id}`}>
        <div className={`relative ${!product.inStock ? "opacity-50" : ""}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
              <span className="text-lg font-medium text-gray-600">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mt-2 font-raleway text-lg font-medium">
            {product.name}
          </h3>
          <p className="font-raleway text-lg font-bold text-primary">
            {price && price.currency
              ? formatPrice(price.amount, price.currency.symbol)
              : "Price not available"}
          </p>
        </div>
      </Link>
      {product.inStock && isHovered && (
        <button
          className="absolute bottom-28 right-4 bg-primary text-white p-2 rounded-full 
                     shadow-lg hover:bg-primary-dark transition-colors duration-200
                     w-12 h-12 flex items-center justify-center"
          onClick={handleQuickShop}
          aria-label="Quick Shop"
        >
          <img src={cartIcon} alt="Cart" className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ProductCard;
