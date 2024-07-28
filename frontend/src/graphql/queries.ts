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
  query GetProducts {
    products {
      id
      category
      name
      gallery
      prices {
        amount
        currency {
          label
          symbol
        }
      }
    }
  }
`;
