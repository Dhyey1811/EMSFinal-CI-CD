import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import EmployeeTable from '../EmployeeTable';
import { GET_EMPLOYEES, DELETE_EMPLOYEE } from '../graphql/queries'; // Ensure correct import

const mockEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    dateOfJoining: '1672531200000', // Example timestamp
    title: 'Software Engineer',
    department: 'IT',
    employeeType: 'FullTime',
    currentStatus: true,
  },
];

const mocks = [
  {
    request: {
      query: GET_EMPLOYEES,
      variables: { employeeType: 'ALL' },
    },
    result: {
      data: { getEmployees: mockEmployees },
    },
  },
  {
    request: {
      query: DELETE_EMPLOYEE,
      variables: { id: '1' },
    },
    result: {
      data: { deleteEmployee: { id: '1' } },
    },
  },
];

describe('EmployeeTable Component', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <EmployeeTable />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders employee data after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <EmployeeTable />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('John'));

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
  });

  it('allows deleting an employee', async () => {
    window.confirm = jest.fn(() => true);

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <EmployeeTable />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('John'));

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete?');
  });

  it('filters employees by type', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <EmployeeTable />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('John'));

    const selectBox = screen.getByLabelText('Employee Type');
    fireEvent.change(selectBox, { target: { value: 'FullTime' } });

    await waitFor(() => expect(selectBox.value).toBe('FullTime'));
  });
});
