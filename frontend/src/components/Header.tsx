import React from "react";
import Logo from "./svg_components/Logo";
import Cart from "./svg_components/Cart";
import Navigation from "./Navigation";

interface HeaderState {
  activeCategory: string;
}

class Header extends React.Component<{}, HeaderState> {
  state: HeaderState = {
    activeCategory: "women",
  };

  handleCategoryChange = (category: string) => {
    this.setState({ activeCategory: category });
  };

  render() {
    const categories = ["women", "men", "kids"];
    const { activeCategory } = this.state;

    return (
      <header className="flex items-center justify-between px-4 py-4 bg-white relative">
        <div className="flex-1">
          <Navigation
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={this.handleCategoryChange}
          />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo className="w-12 h-12" />
        </div>
        <div className="flex-1 flex justify-end">
          <Cart className="w-6 h-6 text-text hover:text-primary" />
        </div>
      </header>
    );
  }
}

export default Header;
