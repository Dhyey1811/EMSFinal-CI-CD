import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EmployeeTable from '../EmployeeTable';
import { gql } from '@apollo/client';

// 🔁 Copy of the same query used inside EmployeeTable.jsx
const GET_EMPLOYEES = gql`
  query GetEmployees($employeeType: EmployeeType) {
    getEmployees(employeeType: $employeeType) {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

const mockEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    age: '60',
    dateOfJoining: `${new Date().getTime() - 40 * 365 * 24 * 60 * 60 * 1000}`,
    title: 'Manager',
    department: 'IT',
    employeeType: 'FullTime',
    currentStatus: true,
  },
];

const mocks = [
  {
    request: {
      query: GET_EMPLOYEES,
      variables: { employeeType: 'ALL' }, // ✅ match default filter state
    },
    result: {
      data: {
        getEmployees: mockEmployees,
      },
    },
  },
];

describe('EmployeeTable Component', () => {
  test('renders employee table with mocked data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<EmployeeTable />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    // Check loading first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for employee to load
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText(/Manager/i)).toBeInTheDocument();
    });
  });
});
