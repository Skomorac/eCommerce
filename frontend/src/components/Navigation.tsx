import React from "react";

interface NavigationProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

interface NavigationState {
  isOpen: boolean;
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  state: NavigationState = {
    isOpen: false,
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  handleCategoryClick = (category: string) => {
    this.props.onCategoryChange(category);
    this.setState({ isOpen: false });
  };

  render() {
    const { categories, activeCategory } = this.props;
    const { isOpen } = this.state;

    return (
      <nav className="relative font-raleway">
        <button
          className="block lg:hidden text-text hover:text-primary focus:outline-none"
          onClick={this.toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
            />
          </svg>
        </button>
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } lg:flex lg:space-x-4 absolute lg:static left-0 right-0 top-full bg-white lg:bg-transparent shadow-md lg:shadow-none mt-2 lg:mt-0 z-10`}
        >
          {categories.map((category) => (
            <li key={category}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleCategoryClick(category);
                }}
                className={`
                  block px-4 py-2 text-sm lg:text-base 
                  ${
                    category === activeCategory
                      ? "text-primary font-bold border-b-2 border-primary"
                      : "text-text hover:text-accent"
                  }
                  transition-colors duration-200
                `}
                data-testid={
                  category === activeCategory
                    ? "active-category-link"
                    : "category-link"
                }
              >
                {category.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Navigation;
