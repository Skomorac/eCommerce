import React from "react";
import logo from "../../assets/images/logo.svg";

interface LogoProps {
  className?: string;
}

class Logo extends React.Component<LogoProps> {
  render() {
    const { className = "" } = this.props;

    return (
      <img
        src={logo}
        alt="Store Logo"
        className={`w-8 h-8 ${className}`} // Adjust size as needed
      />
    );
  }
}

export default Logo;
