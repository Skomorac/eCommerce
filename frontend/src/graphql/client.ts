// src/graphql/client.ts

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost/graphql", // Replace with your actual GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
