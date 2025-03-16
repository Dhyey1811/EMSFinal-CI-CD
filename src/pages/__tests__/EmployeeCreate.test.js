import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom'; // Required for useNavigate
import EmployeeCreate, { CREATE_EMPLOYEE } from '../EmployeeCreate'; // Import the EmployeeCreate component

// Mocked Apollo Client response for the mutation
const mocks = [
  {
    request: {
      query: CREATE_EMPLOYEE,
      variables: {
        firstName: 'John',
        lastName: 'Doe',
        age: '30',
        dateOfJoining: '2022-01-01',
        title: 'Employee',
        department: 'IT',
        employeeType: 'FullTime',
        currentStatus: true,
      },
    },
    result: {
      data: {
        createEmployee: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          age: '30',
          dateOfJoining: '2022-01-01',
          title: 'Employee',
          department: 'IT',
          employeeType: 'FullTime',
          currentStatus: true,
        },
      },
    },
  },
];

// Test suite
describe('EmployeeCreate Component', () => {
  test('renders EmployeeCreate form', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <EmployeeCreate />
        </Router>
      </MockedProvider>
    );

    // Check if the form fields are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of joining/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employee type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current status/i)).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    const { getByLabelText, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <EmployeeCreate />
        </Router>
      </MockedProvider>
    );

    // Simulate user interaction
    fireEvent.change(getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText(/age/i), { target: { value: '30' } });
    fireEvent.change(getByLabelText(/date of joining/i), { target: { value: '2022-01-01' } });

    // Submit the form
    fireEvent.click(getByRole('button', { name: /add employee/i }));

    // Wait for the mutation to complete and check if the response is handled
    await waitFor(() => expect(screen.getByText(/adding employee.../i)).not.toBeInTheDocument());
  });
});
