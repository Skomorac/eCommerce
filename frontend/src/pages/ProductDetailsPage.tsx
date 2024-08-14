import React from "react";
import { Query } from "@apollo/client/react/components";
import { GET_PRODUCT } from "../graphql/queries";
import ProductGallery from "../components/ProductGallery";
import ProductAttributes from "../components/ProductAttributes";
import AddToCartButton from "../components/AddToCartButton";
import { parseHtml } from "../utils/htmlParser";
import { CartContext, CartContextType } from "../context/CartContext";

interface Currency {
  label: string;
  symbol: string;
}

interface Price {
  amount: string;
  currency: Currency;
}

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface ProductDetails {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  prices: Price[];
  attributes: Attribute[];
}

interface ProductData {
  product: ProductDetails;
}

interface AttributeValue {
  value: string;
  displayValue: string;
}

interface ProductDetailsPageProps {
  productId: string;
}

interface ProductDetailsPageState {
  selectedAttributes: Record<string, AttributeValue>;
}

class ProductDetailsPage extends React.Component<
  ProductDetailsPageProps,
  ProductDetailsPageState
> {
  static contextType = CartContext;
  declare context: React.ContextType<typeof CartContext>;

  constructor(props: ProductDetailsPageProps) {
    super(props);
    this.state = {
      selectedAttributes: {},
    };
  }

  componentDidUpdate(prevProps: ProductDetailsPageProps) {
    if (prevProps.productId !== this.props.productId) {
      this.setState({ selectedAttributes: {} });
    }
  }

  initializeAttributes = (product: ProductDetails) => {
    if (product.attributes && product.attributes.length > 0) {
      const initialAttributes: Record<string, AttributeValue> = {};
      product.attributes.forEach((attr) => {
        initialAttributes[attr.attribute_id] = { value: "", displayValue: "" };
      });
      this.setState({ selectedAttributes: initialAttributes });
    }
  };

  handleAttributeSelect = (
    attributeId: string,
    value: string,
    displayValue: string
  ) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeId]: { value, displayValue },
      },
    }));
  };

  formatPrice = (amount: string, symbol: string) => {
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  isAllAttributesSelected = (product: ProductDetails) => {
    if (!product.attributes || product.attributes.length === 0) {
      return true;
    }
    return product.attributes.every(
      (attr) => this.state.selectedAttributes[attr.attribute_id]?.value !== ""
    );
  };

  renderProductDetails = (product: ProductDetails) => {
    const isAllAttributesSelected = this.isAllAttributesSelected(product);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <ProductGallery gallery={product.gallery} />
          </div>
          <div className="md:w-1/3 md:pl-8">
            <h1
              className="text-3xl font-semibold mb-4"
              data-testid="product-name"
            >
              {product.name}
            </h1>

            {product.attributes && product.attributes.length > 0 && (
              <ProductAttributes
                attributes={product.attributes}
                selectedAttributes={this.state.selectedAttributes}
                onSelect={this.handleAttributeSelect}
              />
            )}

            <p className="text-2xl font-bold my-6" data-testid="product-price">
              PRICE:
              <br />
              {this.formatPrice(
                product.prices[0].amount,
                product.prices[0].currency.symbol
              )}
            </p>

            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: parseFloat(product.prices[0].amount),
                gallery: product.gallery,
              }}
              selectedAttributes={this.state.selectedAttributes}
              allAttributes={product.attributes || []}
              inStock={product.inStock}
              allAttributesSelected={isAllAttributesSelected}
            />

            {product.inStock && !isAllAttributesSelected && (
              <p className="text-muted mt-2">
                Please select all attributes before adding to cart.
              </p>
            )}

            {!product.inStock && (
              <p className="text-muted mt-2">
                This product is currently out of stock.
              </p>
            )}

            <div className="mt-8" data-testid="product-description">
              {parseHtml(product.description)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Query<ProductData>
        query={GET_PRODUCT}
        variables={{ id: this.props.productId }}
      >
        {({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error: {error.message}</div>;
          if (!data || !data.product)
            return <div>No product data available</div>;

          const product = data.product;

          if (
            product.attributes &&
            product.attributes.length > 0 &&
            Object.keys(this.state.selectedAttributes).length === 0
          ) {
            setTimeout(() => this.initializeAttributes(product), 0);
            return null;
          }

          return this.renderProductDetails(product);
        }}
      </Query>
    );
  }
}

interface ProductDetailsPageWrapperState {
  productId: string | null;
}

class ProductDetailsPageWrapper extends React.Component<
  {},
  ProductDetailsPageWrapperState
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      productId: null,
    };
  }

  componentDidMount() {
    const pathParts = window.location.pathname.split("/");
    const productId = pathParts[pathParts.length - 1];
    this.setState({ productId });
  }

  render() {
    const { productId } = this.state;

    if (!productId) {
      return <div>Error: Product ID is missing</div>;
    }

    return <ProductDetailsPage productId={productId} />;
  }
}

export default ProductDetailsPageWrapper;
