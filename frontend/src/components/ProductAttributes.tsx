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
      {Object.values(groupedAttributes).map((attribute) => (
        <div
          key={attribute.id}
          data-testid={`product-attribute-${attribute.id
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <h3 className="text-lg font-semibold mb-2">{attribute.id}:</h3>
          <div className="flex flex-wrap">
            {attribute.items.map((item) => (
              <button
                key={item.id}
                className={`mr-2 mb-2 p-2 border ${
                  selectedAttributes[attribute.id] === item.value
                    ? "border-primary"
                    : "border-gray-300"
                } ${attribute.id.toLowerCase() === "color" ? "w-10 h-10" : ""}`}
                style={
                  attribute.id.toLowerCase() === "color"
                    ? { backgroundColor: item.value }
                    : {}
                }
                onClick={() => onSelect(attribute.id, item.value)}
              >
                {attribute.id.toLowerCase() !== "color" && item.displayValue}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductAttributes;
