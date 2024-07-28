// src/components/Title.tsx

import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  const formattedText =
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <h1 className="font-raleway text-[42px] font-light leading-[67.2px] text-left">
      {formattedText}
    </h1>
  );
};

export default Title;
