import { ApolloClient, InMemoryCache } from '@apollo/client';

const Client = new ApolloClient({
  uri: 'http://localhost:8080/v1/graphql',
  cache: new InMemoryCache()
})

export default Client;