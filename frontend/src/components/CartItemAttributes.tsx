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

class CartItemAttributes extends React.Component<CartItemAttributesProps> {
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

  getAttributeStyle = (
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

  render() {
    const { attributes, selectedAttributes } = this.props;

    if (!attributes || attributes.length === 0) {
      return null;
    }

    const groupedAttributes = this.groupAttributes(attributes);

    return (
      <div>
        {Object.entries(groupedAttributes).map(([attributeId, attribute]) => (
          <div
            key={attributeId}
            className="mt-2"
            data-testid={`cart-item-attribute-${attributeId.toLowerCase()}`}
          >
            <span className="font-semibold mb-1">{attributeId}:</span>
            <div className="flex flex-wrap">
              {attribute.items.map((item, index) => {
                const isSelected =
                  (selectedAttributes &&
                    selectedAttributes[attributeId]?.value === item.value) ||
                  (!selectedAttributes && index === 0);
                return (
                  <div
                    key={item.id}
                    className={this.getAttributeStyle(
                      attributeId,
                      isSelected,
                      item.value
                    )}
                    style={
                      attributeId.toLowerCase() === "color"
                        ? { backgroundColor: item.value }
                        : {}
                    }
                    data-testid={`cart-item-attribute-${attributeId.toLowerCase()}-${
                      item.displayValue
                    }${isSelected ? "-selected" : ""}`}
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
  }
}

export default CartItemAttributes;
