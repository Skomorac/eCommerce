import React from "react";

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface AttributeValue {
  value: string;
  displayValue: string;
}

interface ProductAttributesProps {
  attributes: Attribute[];
  selectedAttributes: Record<string, AttributeValue>;
  onSelect: (attributeId: string, value: string, displayValue: string) => void;
}

class ProductAttributes extends React.Component<ProductAttributesProps> {
  groupAttributes = (attributes: Attribute[]) => {
    return attributes.reduce((acc, attr) => {
      if (!acc[attr.attribute_id]) {
        acc[attr.attribute_id] = {
          id: attr.attribute_id,
          items: [],
        };
      }
      acc[attr.attribute_id].items.push(attr);
      return acc;
    }, {} as Record<string, { id: string; items: Attribute[] }>);
  };

  getButtonStyle = (
    attributeId: string,
    isSelected: boolean,
    value: string
  ) => {
    const baseStyle = "mr-2 mb-2 p-2 border transition-all duration-200 ";

    if (attributeId.toLowerCase() === "color") {
      return `${baseStyle} w-10 h-10 rounded-full ${
        isSelected ? "ring-2 ring-offset-2 ring-black" : ""
      }`;
    } else {
      return `${baseStyle} ${
        isSelected
          ? "bg-black text-white border-black"
          : "border-gray-300 hover:border-gray-400"
      }`;
    }
  };

  render() {
    const { attributes, selectedAttributes, onSelect } = this.props;
    const groupedAttributes = this.groupAttributes(attributes);

    return (
      <div>
        {Object.entries(groupedAttributes).map(([attributeId, attribute]) => (
          <div
            key={attributeId}
            data-testid={`product-attribute-${attributeId.toLowerCase()}`}
          >
            <h3 className="text-lg font-semibold mb-2">{attributeId}:</h3>
            <div className="flex flex-wrap">
              {attribute.items.map((item) => {
                const isSelected =
                  selectedAttributes[attributeId]?.value === item.value;
                return (
                  <button
                    key={item.id}
                    data-testid={`product-attribute-${attributeId.toLowerCase()}-${
                      item.displayValue
                    }`}
                    className={this.getButtonStyle(
                      attributeId,
                      isSelected,
                      item.value
                    )}
                    style={
                      attributeId.toLowerCase() === "color"
                        ? { backgroundColor: item.value }
                        : {}
                    }
                    onClick={() =>
                      onSelect(attributeId, item.value, item.displayValue)
                    }
                  >
                    {attributeId.toLowerCase() !== "color" && item.displayValue}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ProductAttributes;
