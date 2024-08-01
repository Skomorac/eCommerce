// src/components/ProductGallery.tsx
import React, { useState } from "react";

interface ProductGalleryProps {
  gallery: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ gallery }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="md:w-1/2" data-testid="product-gallery">
      <div className="relative">
        <img src={gallery[currentImage]} alt="Product" className="w-full" />
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2"
          onClick={() =>
            setCurrentImage((prev) =>
              prev > 0 ? prev - 1 : gallery.length - 1
            )
          }
        >
          ←
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
          onClick={() =>
            setCurrentImage((prev) =>
              prev < gallery.length - 1 ? prev + 1 : 0
            )
          }
        >
          →
        </button>
      </div>
      <div className="flex mt-4 overflow-x-auto">
        {gallery.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Product ${index + 1}`}
            className={`w-20 h-20 object-cover mr-2 cursor-pointer ${
              index === currentImage ? "border-2 border-primary" : ""
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
