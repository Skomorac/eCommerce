// src/components/ProductGallery.tsx
import React, { useState } from "react";

interface ProductGalleryProps {
  gallery: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ gallery }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="flex" data-testid="product-gallery">
      <div className="w-1/4 mr-4">
        {gallery.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Product ${index + 1}`}
            className={`w-full h-auto mb-2 cursor-pointer ${
              index === currentImage ? "border-2 border-primary" : ""
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
      <div className="w-3/4 relative">
        <img
          src={gallery[currentImage]}
          alt="Product"
          className="w-full h-auto"
        />
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
          onClick={() =>
            setCurrentImage((prev) =>
              prev > 0 ? prev - 1 : gallery.length - 1
            )
          }
        >
          ←
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
          onClick={() =>
            setCurrentImage((prev) =>
              prev < gallery.length - 1 ? prev + 1 : 0
            )
          }
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
