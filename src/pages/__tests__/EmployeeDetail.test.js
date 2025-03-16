import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import EmployeeDetail, { GET_EMPLOYEE } from '../EmployeeDetail'; // Adjust the import to match your file structure
import { calculateTimeUntilRetirement } from '../../utils/calculateRetirementTime';

// Mocking Apollo GraphQL query response
const mocks = [
  {
    request: {
      query: GET_EMPLOYEE,
      variables: { id: '1' },
    },
    result: {
      data: {
        getEmployee: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          age: '30',
          dateOfJoining: '2015-01-01',
          title: 'Software Engineer',
          department: 'IT',
          employeeType: 'FullTime',
        },
      },
    },
  },
  {
    request: {
      query: GET_EMPLOYEE,
      variables: { id: '2' },
    },
    result: {
      data: {
        getEmployee: {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          age: '65',
          dateOfJoining: '1985-03-15',
          title: 'Senior Developer',
          department: 'Engineering',
          employeeType: 'PartTime',
        },
      },
    },
  },
];

// Unit Test Suite
describe('EmployeeDetail Component', () => {
  test('renders loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Router>
          <EmployeeDetail />
        </Router>
      </MockedProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders error state when there is an error loading employee data', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_EMPLOYEE,
          variables: { id: '1' },
        },
        error: new Error('Error loading employee data'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Router>
          <EmployeeDetail />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading employee data/i)).toBeInTheDocument();
    });
  });

  test('renders employee details correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <EmployeeDetail />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Employee Details/i)).toBeInTheDocument();
      expect(screen.getByText(/First Name:/i)).toHaveTextContent('John');
      expect(screen.getByText(/Last Name:/i)).toHaveTextContent('Doe');
      expect(screen.getByText(/Age:/i)).toHaveTextContent('30');
      expect(screen.getByText(/Department:/i)).toHaveTextContent('IT');
      expect(screen.getByText(/Employee Type:/i)).toHaveTextContent('FullTime');
    });
  });

  test('shows retirement information for an employee', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <EmployeeDetail />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      // Check retirement details for an employee (assuming they are not retired)
      expect(screen.getByText(/Years until Retirement:/i)).toBeInTheDocument();
    });
  });

  test('displays "Retired: Yes" for employees who have retired', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <EmployeeDetail />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      // Assuming that the employee with ID 2 is retired
      expect(screen.getByText(/Retired: Yes/i)).toBeInTheDocument();
      expect(screen.getByText(/Age:/i)).toHaveTextContent('65');
    });
  });

  test('does not show retirement info if employee is not found', async () => {
    const notFoundMocks = [
      {
        request: {
          query: GET_EMPLOYEE,
          variables: { id: '999' },
        },
        result: {
          data: { getEmployee: null },
        },
      },
    ];

    render(
      <MockedProvider mocks={notFoundMocks} addTypename={false}>
        <Router>
          <EmployeeDetail />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Employee not found/i)).toBeInTheDocument();
    });
  });
});
