// src/graphql/queries.ts

import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      inStock
      gallery
      description
      category
      brand
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      attributes {
        id
        attribute_id
        value
        displayValue
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category
      brand
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      attributes {
        id
        attribute_id
        value
        displayValue
      }
    }
  }
`;

export const GET_CURRENCIES = gql`
  query GetCurrencies {
    currencies {
      label
      symbol
    }
  }
`;

// If you have a mutation for placing an order, you might include it like this:
export const PLACE_ORDER = gql`
  mutation placeOrder($OrderInput: OrderInput!) {
    placeOrder(OrderInput: $OrderInput)
  }
`;

// You might also want to add a query for fetching orders if that's part of your app:
export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      total_amount
      total_currency
      status
      created_at
      updated_at
      items {
        id
        product_id
        product_name
        quantity
        paid_amount
        paid_currency
      }
    }
  }
`;
