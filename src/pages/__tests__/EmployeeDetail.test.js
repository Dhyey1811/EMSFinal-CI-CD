import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EmployeeDetail from '../EmployeeDetail';
import { gql } from '@apollo/client';

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
    }
  }
`;

const mockEmployee = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  age: '50',
  dateOfJoining: `${new Date().getTime() - 10 * 365 * 24 * 60 * 60 * 1000}`, // 10 years ago
  title: 'Manager',
  department: 'HR',
  employeeType: 'FullTime',
};

const mocks = [
  {
    request: {
      query: GET_EMPLOYEE,
      variables: { id: '123' },
    },
    result: {
      data: {
        getEmployee: mockEmployee,
      },
    },
  },
];

describe('EmployeeDetail Component', () => {
  test('renders employee details and retirement info', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/123/detail']}>
          <Routes>
            <Route path="/:id/detail" element={<EmployeeDetail />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Employee Details')).toBeInTheDocument();
      expect(screen.getByText(/John/)).toBeInTheDocument();
      expect(screen.getByText(/Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Retirement Information/)).toBeInTheDocument();
    });
  });

  test('renders error message on GraphQL error', async () => {
    const errorMock = [
      {
        request: {
          query: GET_EMPLOYEE,
          variables: { id: '123' },
        },
        error: new Error('Failed to fetch'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <MemoryRouter initialEntries={['/123/detail']}>
          <Routes>
            <Route path="/:id/detail" element={<EmployeeDetail />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading employee data/i)).toBeInTheDocument();
    });
  });
});
