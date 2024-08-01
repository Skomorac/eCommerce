// src/components/svg_components/Logo.tsx

import React from "react";
import logo from "../../assets/images/logo.svg";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

class Logo extends React.Component<LogoProps> {
  render() {
    const { className = "", onClick } = this.props;

    return (
      <div
        className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${className}`}
        onClick={onClick}
      >
        <img
          src={logo}
          alt="Store Logo"
          className="w-8 h-8" // Adjust size as needed
        />
      </div>
    );
  }
}

export default Logo;
