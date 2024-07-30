import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import QuickShop from "./svg_components/QuickShop";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

interface ProductListProps {
  category: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  gallery: string[];
  prices: { amount: string; currency: { symbol: string } }[];
  inStock: boolean;
}

interface ProductListState {
  hoveredProductId: string | null;
  message: string | null;
}

interface QueryData {
  products: Product[];
}

const formatPrice = (amount: string): string => {
  const parsedAmount = parseFloat(amount);
  return isNaN(parsedAmount) ? amount : parsedAmount.toFixed(2);
};

class ProductListComponent extends React.Component<
  ProductListProps & { data: QueryData },
  ProductListState
> {
  static contextType = CartContext;
  declare context: React.ContextType<typeof CartContext>;

  state: ProductListState = {
    hoveredProductId: null,
    message: null,
  };

  setHoveredProductId = (id: string | null) => {
    this.setState({ hoveredProductId: id });
  };

  addToCart = (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.context.incrementCartCount();
    this.setState({ message: `${product.name} added to cart` });
    setTimeout(() => this.setState({ message: null }), 3000);
  };

  render() {
    const { category, data } = this.props;
    const { hoveredProductId, message } = this.state;

    const filteredProducts =
      category === "all"
        ? data.products
        : data.products.filter(
            (product: Product) => product.category === category
          );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {message && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded">
            {message}
          </div>
        )}
        {filteredProducts.map((product: Product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="border rounded-lg shadow-lg relative p-4 transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl"
            data-testid={`product-${product.name
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
            onMouseEnter={() => this.setHoveredProductId(product.id)}
            onMouseLeave={() => this.setHoveredProductId(null)}
          >
            <div className="relative pt-[100%] mb-4">
              <img
                src={product.gallery[0]}
                alt={product.name}
                className={`absolute top-0 left-0 w-full h-full object-contain rounded-lg ${
                  !product.inStock ? "filter grayscale" : ""
                }`}
              />
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                  Out of Stock
                </div>
              )}
            </div>
            <h2 className="font-raleway text-[18px] font-light leading-[28.8px] text-left mb-2">
              {product.name}
            </h2>
            <p className="font-raleway text-[18px] font-normal leading-[28.8px] text-left mb-4">
              {product.prices[0].currency.symbol}
              {formatPrice(product.prices[0].amount)}
            </p>
            {hoveredProductId === product.id && product.inStock && (
              <div className="absolute bottom-28 right-12 transform translate-x-1/2 translate-y-1/2">
                <QuickShop
                  className="bg-primary text-white rounded-full p-2 shadow-md transition-transform duration-200 transform hover:scale-110 hover:bg-accent cursor-pointer"
                  onClick={(e) => this.addToCart(product, e)}
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    );
  }
}

const WithQuery = (
  WrappedComponent: React.ComponentType<ProductListProps & { data: QueryData }>
) => {
  return (props: ProductListProps) => {
    const { loading, error, data } = useQuery<QueryData>(GET_PRODUCTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No data</p>;

    return <WrappedComponent {...props} data={data} />;
  };
};

const ProductList = WithQuery(ProductListComponent);

export default ProductList;
