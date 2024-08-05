import React, { useState, useRef, useEffect } from "react";
import ArrowLeft from "../assets/images/arrow-left.svg";
import ArrowRight from "../assets/images/arrow-right.svg";

interface ProductGalleryProps {
  gallery: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ gallery }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const navigateImage = (direction: "prev" | "next") => {
    setCurrentImage((prev) =>
      direction === "prev"
        ? prev > 0
          ? prev - 1
          : gallery.length - 1
        : prev < gallery.length - 1
        ? prev + 1
        : 0
    );
  };

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const selectedThumb = thumbnailContainerRef.current.children[
        currentImage
      ] as HTMLElement;
      selectedThumb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentImage]);

  return (
    <div className="flex flex-col md:flex-row" data-testid="product-gallery">
      {/* Mobile view */}
      <div className="md:hidden w-full mb-4">
        <div className="relative">
          <img
            src={gallery[currentImage]}
            alt={`Product ${currentImage + 1}`}
            className="w-full h-auto object-contain"
          />
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
            onClick={() => navigateImage("prev")}
            aria-label="Previous image"
          >
            <img src={ArrowLeft} alt="" className="w-6 h-6" />
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
            onClick={() => navigateImage("next")}
            aria-label="Next image"
          >
            <img src={ArrowRight} alt="" className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4 overflow-x-auto whitespace-nowrap">
          {gallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product ${index + 1}`}
              className={`inline-block w-20 h-20 mr-2 cursor-pointer object-cover ${
                index === currentImage ? "border-2 border-primary" : ""
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div
        className="hidden md:block w-1/4 pr-4 mb-4 md:mb-0 h-[70vh] overflow-y-auto"
        ref={thumbnailContainerRef}
      >
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
      <div className="hidden md:block w-3/4 relative flex justify-center items-top">
        <div className="relative max-w-full max-h-[70vh]">
          <img
            src={gallery[currentImage]}
            alt={`Product ${currentImage + 1}`}
            className="max-w-full max-h-[70vh] object-contain"
          />
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2"
            onClick={() => navigateImage("prev")}
            aria-label="Previous image"
          >
            <img src={ArrowLeft} alt="" className="w-10 h-10" />
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
            onClick={() => navigateImage("next")}
            aria-label="Next image"
          >
            <img src={ArrowRight} alt="" className="w-10 h-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
