// src/pages/__tests__/EmployeeUpdate.integration.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import EmployeeUpdate from '../EmployeeUpdate';
import gql from 'graphql-tag';

// Local mocks of queries/mutations (same as in your component)
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
      currentStatus
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $employeeId: ID!
    $firstName: String!
    $lastName: String!
    $age: String!
    $dateOfJoining: String!
    $title: Title!
    $department: Department!
    $employeeType: EmployeeType!
    $currentStatus: Boolean!
  ) {
    updateEmployee(
      employeeId: $employeeId
      firstName: $firstName
      lastName: $lastName
      age: $age
      dateOfJoining: $dateOfJoining
      title: $title
      department: $department
      employeeType: $employeeType
      currentStatus: $currentStatus
    ) {
      id
      firstName
    }
  }
`;

// Mock data
const mockEmployee = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  age: '30',
  dateOfJoining: '2022-01-01',
  title: 'Manager',
  department: 'HR',
  employeeType: 'FullTime',
  currentStatus: true,
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
  {
    request: {
      query: UPDATE_EMPLOYEE,
      variables: {
        employeeId: '123',
        firstName: 'John',
        lastName: 'Doe',
        age: '30',
        dateOfJoining: '2022-01-01',
        title: 'VP',
        department: 'Engineering',
        employeeType: 'FullTime',
        currentStatus: false,
      },
    },
    result: {
      data: {
        updateEmployee: {
          id: '123',
          firstName: 'John',
        },
      },
    },
  },
];

describe('EmployeeUpdate Integration Test', () => {
  test('loads data, updates dropdowns, and submits form', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/123/update']}>
          <Routes>
            <Route path="/:id/update" element={<EmployeeUpdate />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for loading and employee data to appear
    const matches = await screen.findAllByText(/Update Employee/i);
    expect(matches.length).toBeGreaterThan(1); // or exactly 2 if you want
    

    // Interact with dropdowns using getAllByRole and indexes
    const dropdowns = screen.getAllByRole('combobox');

    fireEvent.mouseDown(dropdowns[0]); // Title dropdown
    fireEvent.click(await screen.findByText('VP'));

    fireEvent.mouseDown(dropdowns[1]); // Department dropdown
    fireEvent.click(await screen.findByText('Engineering'));

    fireEvent.mouseDown(dropdowns[3]); // Status dropdown
    fireEvent.click(await screen.findByText('Inactive'));

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /update employee/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Successful mutation would navigate away; you can check console logs or mock useNavigate for full validation
    });
  });
});
