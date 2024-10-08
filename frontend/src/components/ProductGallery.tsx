import React from "react";
import ArrowLeft from "../assets/images/arrow-left.svg";
import ArrowRight from "../assets/images/arrow-right.svg";

interface ProductGalleryProps {
  gallery: string[];
}

interface ProductGalleryState {
  currentImage: number;
}

class ProductGallery extends React.Component<
  ProductGalleryProps,
  ProductGalleryState
> {
  private thumbnailContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: ProductGalleryProps) {
    super(props);
    this.state = {
      currentImage: 0,
    };
    this.thumbnailContainerRef = React.createRef();
  }

  componentDidUpdate(
    prevProps: ProductGalleryProps,
    prevState: ProductGalleryState
  ) {
    if (prevState.currentImage !== this.state.currentImage) {
      this.scrollSelectedThumbnailIntoView();
    }
  }

  scrollSelectedThumbnailIntoView = () => {
    if (this.thumbnailContainerRef.current) {
      const selectedThumb = this.thumbnailContainerRef.current.children[
        this.state.currentImage
      ] as HTMLElement;
      selectedThumb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  navigateImage = (direction: "prev" | "next") => {
    this.setState((prevState) => ({
      currentImage:
        direction === "prev"
          ? prevState.currentImage > 0
            ? prevState.currentImage - 1
            : this.props.gallery.length - 1
          : prevState.currentImage < this.props.gallery.length - 1
          ? prevState.currentImage + 1
          : 0,
    }));
  };

  setCurrentImage = (index: number) => {
    this.setState({ currentImage: index });
  };

  render() {
    const { gallery } = this.props;
    const { currentImage } = this.state;

    return (
      <div className="flex flex-col md:flex-row" data-testid="product-gallery">
        {/* Mobile view */}
        <div className="md:hidden w-full mb-4">
          <div className="relative flex justify-center items-center">
            <img
              src={gallery[currentImage]}
              alt={`Product ${currentImage + 1}`}
              className="max-w-full max-h-[50vh] object-contain"
            />
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
              onClick={() => this.navigateImage("prev")}
              aria-label="Previous image"
            >
              <img src={ArrowLeft} alt="" className="w-6 h-6" />
            </button>
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
              onClick={() => this.navigateImage("next")}
              aria-label="Next image"
            >
              <img src={ArrowRight} alt="" className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 overflow-x-auto whitespace-nowrap text-center">
            {gallery.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product ${index + 1}`}
                className={`inline-block w-20 h-20 mx-1 cursor-pointer object-cover ${
                  index === currentImage ? "border-2 border-primary" : ""
                }`}
                onClick={() => this.setCurrentImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Desktop view */}
        <div
          className="hidden md:block w-1/4 pr-4 mb-4 md:mb-0 h-[70vh] overflow-y-auto"
          ref={this.thumbnailContainerRef}
        >
          {gallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product ${index + 1}`}
              className={`w-full h-auto mb-2 cursor-pointer ${
                index === currentImage ? "border-2 border-primary" : ""
              }`}
              onClick={() => this.setCurrentImage(index)}
            />
          ))}
        </div>
        <div className="hidden md:flex w-3/4 justify-center items-start">
          <div className="relative">
            <img
              src={gallery[currentImage]}
              alt={`Product ${currentImage + 1}`}
              className="max-w-full max-h-[70vh] object-contain"
            />
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2"
              onClick={() => this.navigateImage("prev")}
              aria-label="Previous image"
            >
              <img src={ArrowLeft} alt="" className="w-10 h-10" />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
              onClick={() => this.navigateImage("next")}
              aria-label="Next image"
            >
              <img src={ArrowRight} alt="" className="w-10 h-10" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductGallery;
