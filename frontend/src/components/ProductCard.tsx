import React from "react";
import { Link } from "react-router-dom";
import cartIcon from "../assets/images/cart.svg";
import { CartContext, CartContextType } from "../context/CartContext";
import Swal from "sweetalert2";

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

interface ProductCardState {
  isHovered: boolean;
}

class ProductCard extends React.Component<ProductCardProps, ProductCardState> {
  static contextType = CartContext;
  declare context: React.ContextType<typeof CartContext>;

  constructor(props: ProductCardProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  formatPrice = (amount: string, symbol: string) => {
    const numericAmount = parseFloat(amount);
    return isNaN(numericAmount)
      ? "N/A"
      : `${symbol}${numericAmount.toFixed(2)}`;
  };

  getDefaultAttributes = (): Record<
    string,
    { value: string; displayValue: string }
  > => {
    const defaultAttrs: Record<
      string,
      { value: string; displayValue: string }
    > = {};
    if (this.props.product.attributes) {
      this.props.product.attributes.forEach((attr) => {
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

  handleQuickShop = (e: React.MouseEvent) => {
    e.preventDefault();
    const { product } = this.props;
    if (product.inStock) {
      const defaultAttributes = this.getDefaultAttributes();
      const { addToCart } = this.context as CartContextType;
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.prices[0].amount),
        quantity: 1,
        attributes: defaultAttributes,
        allAttributes: product.attributes || [],
        image: product.gallery[0],
      });

      // Show SweetAlert2 notification
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });

      console.log(
        `Quick shop: Added ${product.name} to cart with attributes:`,
        defaultAttributes
      );
    } else {
      console.log(`Product ${product.name} is out of stock`);
    }
  };

  setHovered = (isHovered: boolean) => {
    this.setState({ isHovered });
  };

  render() {
    const { product } = this.props;
    const { isHovered } = this.state;
    const mainImage = product.gallery[0] || "";
    const price = product.prices[0];

    return (
      <div
        className={`relative transition-all duration-300 ease-in-out 
                    ${isHovered ? "transform scale-105" : ""}
                    rounded-lg overflow-hidden shadow-md hover:shadow-xl`}
        onMouseEnter={() => this.setHovered(true)}
        onMouseLeave={() => this.setHovered(false)}
        data-testid={`product-${product.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <Link to={`/product/${product.id}`}>
          <div
            className={`relative pb-20 mb-5 ${
              !product.inStock ? "opacity-50" : ""
            }`}
          >
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
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="mt-2 font-raleway text-lg font-medium">
              {product.name}
            </h3>
            <p className="font-raleway text-lg">
              {price && price.currency
                ? this.formatPrice(price.amount, price.currency.symbol)
                : "Price not available"}
            </p>
          </div>
        </Link>
        {product.inStock && isHovered && (
          <button
            className="absolute bottom-28 right-4 bg-primary text-white p-2 rounded-full 
                       shadow-lg hover:bg-primary-dark transition-colors duration-200
                       w-12 h-12 flex items-center justify-center"
            onClick={this.handleQuickShop}
            aria-label="Quick Shop"
          >
            <img src={cartIcon} alt="Cart" className="w-6 h-6" />
          </button>
        )}
      </div>
    );
  }
}

export default ProductCard;
