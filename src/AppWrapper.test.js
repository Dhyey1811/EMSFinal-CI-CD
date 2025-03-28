// __tests__/AppWrapper.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppWrapper from './AppWrapper';  


// ✅ Test Name: AppWrapper renders with ApolloProvider and App
describe('AppWrapper Component', () => {
  test('renders App component through ApolloProvider without crashing', () => {
    render(<AppWrapper />);

    // Adjust this based on your App's first visible content
    const heading = screen.getByText(/employee/i); // Example: “Employee List”, etc.
    expect(heading).toBeInTheDocument();
  });
});
