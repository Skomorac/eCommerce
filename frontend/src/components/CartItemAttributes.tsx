// src/components/CartItemAttributes.tsx

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

interface CartItemAttributesProps {
  attributes: Attribute[] | undefined;
  selectedAttributes: Record<string, AttributeValue> | undefined;
}

const CartItemAttributes: React.FC<CartItemAttributesProps> = ({
  attributes,
  selectedAttributes,
}) => {
  if (!attributes || attributes.length === 0) {
    return null;
  }

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

  const getAttributeStyle = (
    attributeId: string,
    isSelected: boolean,
    value: string
  ) => {
    const baseStyle = "mr-2 mb-2 p-1 border transition-all duration-200 ";

    if (attributeId.toLowerCase() === "color") {
      return `${baseStyle} w-6 h-6 rounded-full ${
        isSelected ? "ring-2 ring-offset-1 ring-black" : ""
      }`;
    } else {
      return `${baseStyle} ${
        isSelected
          ? "bg-black text-white border-black"
          : "border-gray-300 text-gray-500"
      }`;
    }
  };

  return (
    <div>
      {Object.entries(groupedAttributes).map(([attributeId, attribute]) => (
        <div key={attributeId} className="mt-2">
          <span className="font-semibold mb-1">{attributeId}:</span>
          <div className="flex flex-wrap">
            {attribute.items.map((item, index) => {
              const isSelected =
                (selectedAttributes &&
                  selectedAttributes[attributeId]?.value === item.value) ||
                (!selectedAttributes && index === 0); // Select first item if no selection
              return (
                <div
                  key={item.id}
                  className={getAttributeStyle(
                    attributeId,
                    isSelected,
                    item.value
                  )}
                  style={
                    attributeId.toLowerCase() === "color"
                      ? { backgroundColor: item.value }
                      : {}
                  }
                >
                  {attributeId.toLowerCase() !== "color" && (
                    <span className="text-xs">{item.displayValue}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemAttributes;
