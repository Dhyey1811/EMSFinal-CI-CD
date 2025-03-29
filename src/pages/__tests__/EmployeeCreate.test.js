import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import EmployeeCreate from '../EmployeeCreate';
import { gql } from '@apollo/client';

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $firstName: String!
    $lastName: String!
    $age: String!
    $dateOfJoining: String!
    $title: Title!
    $department: Department!
    $employeeType: EmployeeType!
    $currentStatus: Boolean!
  ) {
    createEmployee(
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
      lastName
    }
  }
`;

const mocks = [
  {
    request: {
      query: CREATE_EMPLOYEE,
      variables: {
        firstName: 'Jane',
        lastName: 'Doe',
        age: '30',
        dateOfJoining: '2023-01-01',
        title: 'Manager',
        department: 'HR',
        employeeType: 'FullTime',
        currentStatus: true,
      },
    },
    result: {
      data: {
        createEmployee: {
          id: '1',
          firstName: 'Jane',
          lastName: 'Doe',
        },
      },
    },
  },
];

describe('EmployeeCreate Component', () => {
  it('renders form and validates required fields', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <EmployeeCreate />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/Add Employee/i));

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Valid Age is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Date of Joining is required/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <EmployeeCreate />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Date of Joining/i), { target: { value: '2023-01-01' } });

    // Optional: Change dropdowns if needed using screen.getByRole or getByText

    fireEvent.click(screen.getByText(/Add Employee/i));

    await waitFor(() => {
      expect(screen.getByText(/Adding Employee.../i)).toBeInTheDocument();
    });
  });
});
