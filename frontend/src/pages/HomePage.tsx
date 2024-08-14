import React from "react";
import { useParams, useLocation } from "react-router-dom";
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

interface HomePageProps {
  category?: string;
  pathname: string;
}

class HomePage extends React.Component<HomePageProps> {
  render() {
    const { category, pathname } = this.props;
    const activeCategory = category || (pathname === "/" ? "all" : "");
    const title =
      activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

    return (
      <Query<ProductsData>
        query={GET_PRODUCTS}
        variables={{
          category: activeCategory === "all" ? null : activeCategory,
        }}
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

// Wrapper function to use hooks and pass data to the class component
const HomePageWrapper: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();

  return <HomePage category={category} pathname={location.pathname} />;
};

export default HomePageWrapper;
