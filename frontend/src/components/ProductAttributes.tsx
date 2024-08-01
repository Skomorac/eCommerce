// src/components/ProductAttributes.tsx
import React from "react";

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface ProductAttributesProps {
  attributes: Attribute[];
  selectedAttributes: Record<string, string>;
  onSelect: (attributeId: string, value: string) => void;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  attributes,
  selectedAttributes,
  onSelect,
}) => {
  // Group attributes by attribute_id
  const groupedAttributes = attributes.reduce((acc, attr) => {
    if (!acc[attr.attribute_id]) {
      acc[attr.attribute_id] = {
        id: attr.attribute_id,
        items: [],
      };
    }
    acc[attr.attribute_id].items.push(attr);
    return acc;
  }, {} as Record<string, { id: string; items: Attribute[] }>);

  return (
    <div>
      {Object.entries(groupedAttributes).map(([attributeId, attribute]) => (
        <div
          key={attributeId}
          data-testid={`product-attribute-${attributeId.toLowerCase()}`}
        >
          <h3 className="text-lg font-semibold mb-2">{attributeId}:</h3>
          <div className="flex flex-wrap">
            {attribute.items.map((item) => (
              <button
                key={item.id}
                data-testid={`product-attribute-${attributeId.toLowerCase()}-${
                  item.value
                }`}
                className={`mr-2 mb-2 p-2 border ${
                  selectedAttributes[attributeId] === item.value
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300"
                } ${attributeId.toLowerCase() === "color" ? "w-10 h-10" : ""}`}
                style={
                  attributeId.toLowerCase() === "color"
                    ? { backgroundColor: item.value }
                    : {}
                }
                onClick={() => onSelect(attributeId, item.value)}
              >
                {attributeId.toLowerCase() !== "color" && item.displayValue}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductAttributes;
