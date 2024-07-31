import { ApolloClient, InMemoryCache } from "@apollo/client";

const isProd = process.env.NODE_ENV === "production";

const client = new ApolloClient({
  uri: isProd ? "https://shop.skomorac.in/graphql" : "http://localhost/graphql",
  cache: new InMemoryCache(),
});

export default client;
