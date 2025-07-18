import React from "react";
import { Query } from "@apollo/client/react/components";
import { GET_PRODUCTS } from "../graphql/queries";
import ProductCard from "../components/ProductCard";

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
    amount: number | string;
    currency: {
      symbol: string;
    };
  }[];
  description?: string;
  category?: string;
  brand?: string;
  attributes?: Attribute[];
}

interface ProductsData {
  products: Product[];
}

interface HomePageState {
  category: string;
  pathname: string;
}

class HomePage extends React.Component<{}, HomePageState> {
  constructor(props: {}) {
    super(props);
    this.state = this.getStateFromURL();
  }

  componentDidMount() {
    window.addEventListener("popstate", this.handleLocationChange);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handleLocationChange);
  }

  componentDidUpdate(prevProps: {}, prevState: HomePageState) {
    const newState = this.getStateFromURL();
    if (this.state.category !== newState.category) {
      this.setState(newState);
    }
  }

  getStateFromURL = () => {
    const pathname = window.location.pathname;
    const category = pathname.split("/")[1] || "all";
    return { category, pathname };
  };

  handleLocationChange = () => {
    this.setState(this.getStateFromURL());
  };

  render() {
    const { category } = this.state;
    const activeCategory = category || "all";
    const title =
      activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

    return (
      <Query<ProductsData>
        query={GET_PRODUCTS}
        variables={{
          category: activeCategory === "all" ? null : activeCategory,
        }}
        key={activeCategory} // This ensures the query is retriggered on category change
      >
        {({ data, loading, error }) => {
          if (loading) return <div>Loading products...</div>;
          if (error) return <div>Error loading products: {error.message}</div>;

          return (
            <div className="container mx-auto px-4">
              <h1 className="font-raleway text-[42px] font-normal leading-[67.2px] text-left text-text mt-8 mb-6">
                {title}
              </h1>
              <div className="grid grid-cols-auto-fill-350 gap-8">
                {data?.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      prices: product.prices.map((price) => ({
                        ...price,
                        amount: price.amount.toString(),
                      })),
                    }}
                  />
                ))}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default HomePage;
