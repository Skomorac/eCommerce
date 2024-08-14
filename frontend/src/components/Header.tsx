import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Query } from "@apollo/client/react/components";
import { GET_CATEGORIES } from "../graphql/queries";
import { CartContext, CartContextType } from "../context/CartContext";
import cartIcon from "../assets/images/cart.svg";
import logoIcon from "../assets/images/logo.svg";

interface Category {
  id: string;
  name: string;
}

interface CategoriesData {
  categories: Category[];
}

interface HeaderProps {
  toggleCart: () => void;
}

interface HeaderState {
  pathname: string;
}

// This wrapper will pass the location as a prop to our class component
const HeaderWithRouter: React.FC<HeaderProps> = (props) => {
  const location = useLocation();
  return <Header {...props} pathname={location.pathname} />;
};

class Header extends React.Component<
  HeaderProps & { pathname: string },
  HeaderState
> {
  static contextType = CartContext;
  declare context: React.ContextType<typeof CartContext>;

  headerRef: React.RefObject<HTMLElement>;

  constructor(props: HeaderProps & { pathname: string }) {
    super(props);
    this.headerRef = React.createRef();
    this.state = {
      pathname: props.pathname,
    };
  }

  componentDidMount() {
    if (this.headerRef.current) {
      const headerHeight = this.headerRef.current.offsetHeight;
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerHeight}px`
      );
    }
  }

  componentDidUpdate(prevProps: HeaderProps & { pathname: string }) {
    if (this.props.pathname !== prevProps.pathname) {
      this.setState({ pathname: this.props.pathname });
    }
  }

  render() {
    const { toggleCart } = this.props;
    const { getTotalItems } = this.context as CartContextType;

    const activeCategory =
      this.state.pathname === "/" ? "all" : this.state.pathname.slice(1);

    return (
      <Query<CategoriesData> query={GET_CATEGORIES}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error loading categories</div>;

          const categories = [
            "all",
            ...(data?.categories.map((cat) => cat.name) || []),
          ];
          const uniqueCategories = Array.from(new Set(categories));

          return (
            <header
              ref={this.headerRef}
              className="w-full border-b border-[#E5E5E5] z-50 relative bg-white"
            >
              <div className="container mx-auto px-4 flex justify-between items-center py-4 font-raleway text-text">
                <nav className="flex items-center overflow-x-auto">
                  {uniqueCategories.map((category) => (
                    <Link
                      key={category}
                      to={`/${category === "all" ? "" : category}`}
                      data-testid={
                        category === activeCategory
                          ? "active-category-link"
                          : "category-link"
                      }
                      className={`mr-6 uppercase text-base font-semibold leading-[19.2px] text-center whitespace-nowrap ${
                        category === activeCategory
                          ? "text-primary border-b-2 border-primary"
                          : "text-text"
                      }`}
                    >
                      {category}
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="mr-4 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
                  >
                    <img src={logoIcon} alt="Logo" className="w-8 h-8" />
                  </Link>
                  <button
                    data-testid="cart-btn"
                    className="relative"
                    onClick={toggleCart}
                  >
                    <img src={cartIcon} alt="Cart" className="w-6 h-6" />
                    {getTotalItems() > 0 && (
                      <span
                        data-testid="cart-count-bubble"
                        className="absolute -top-2 -right-2 bg-text text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </header>
          );
        }}
      </Query>
    );
  }
}

export default HeaderWithRouter;
