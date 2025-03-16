import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EmployeeUpdate from '../pages/EmployeeUpdate';
import { GET_EMPLOYEE, UPDATE_EMPLOYEE } from '../queries/employeeQueries';

const mockEmployee = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  age: '30',
  dateOfJoining: '2020-01-01',
  title: 'Employee',
  department: 'IT',
  employeeType: 'FullTime',
  currentStatus: true,
};

const mocks = [
  {
    request: {
      query: GET_EMPLOYEE,
      variables: { id: '1' },
    },
    result: {
      data: { getEmployee: mockEmployee },
    },
  },
  {
    request: {
      query: UPDATE_EMPLOYEE,
      variables: { ...mockEmployee, currentStatus: false },
    },
    result: {
      data: { updateEmployee: { ...mockEmployee, currentStatus: false } },
    },
  },
];

test('renders employee update form with fetched data', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={['/update/1']}>
        <Routes>
          <Route path='/update/:id' element={<EmployeeUpdate />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  
  await waitFor(() => screen.getByDisplayValue('John'));
  expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  expect(screen.getByDisplayValue('30')).toBeInTheDocument();
});

test('updates employee status and submits the form', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={['/update/1']}>
        <Routes>
          <Route path='/update/:id' element={<EmployeeUpdate />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  await waitFor(() => screen.getByDisplayValue('John'));

  fireEvent.change(screen.getByLabelText(/Status/i), {
    target: { value: 'false' },
  });

  fireEvent.click(screen.getByText(/Update Employee/i));

  await waitFor(() => {
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
});