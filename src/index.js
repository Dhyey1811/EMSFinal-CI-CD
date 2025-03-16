import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql', // Your GraphQL server URL
  cache: new InMemoryCache(), // In-memory cache for Apollo
});

// Wrap your App component with ApolloProvider to provide Apollo Client to your app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
