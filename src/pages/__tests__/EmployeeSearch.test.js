import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import EmployeeSearch from '../EmployeeSearch'; // Adjust the import path as needed

describe('EmployeeSearch Component', () => {
  test('renders input field and button', () => {
    render(<EmployeeSearch setSearchTerm={jest.fn()} />);
    
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('updates input value when typed', () => {
    render(<EmployeeSearch setSearchTerm={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    expect(input.value).toBe('John Doe');
  });

  test('calls setSearchTerm with input value on submit', () => {
    const mockSetSearchTerm = jest.fn();
    render(<EmployeeSearch setSearchTerm={mockSetSearchTerm} />);
    
    const input = screen.getByPlaceholderText('Search');
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    fireEvent.click(button);
    
    expect(mockSetSearchTerm).toHaveBeenCalledWith('Jane Doe');
  });
});
