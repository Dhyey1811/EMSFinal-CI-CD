import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App'; // ✅ relative to same folder


// Create a test Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

describe('App with ApolloProvider', () => {
  test('renders without crashing', () => {
    render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );

    // Optional: Check if something renders on initial load
    expect(screen.getByText(/employee/i)).toBeInTheDocument(); // change based on your app's content
  });
});
