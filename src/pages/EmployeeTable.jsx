import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { calculateTimeUntilRetirement } from '../utils/calculateRetirementTime';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
} from '@mui/material';

const EmployeeTable = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('ALL');
  const [upcomingRetired, setUpcomingRetired] = useState(false);

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

  const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($id: ID!) {
      deleteEmployee(id: $id) {
        id
        firstName
        lastName
      }
    }
  `;

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      alert('Employee deleted successfully.');
      navigate(0);
    },
    onError: (err) => {
      alert(err.message);
      console.error('Error deleting employee:', err);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      deleteEmployee({ variables: { id } });
    }
  };

  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { employeeType: selectedType },
    fetchPolicy: 'network-only',
  });

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    refetch({ employeeType: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    setUpcomingRetired(event.target.checked);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const isRetirementWithinSixMonths = (dateOfJoining, ageAtJoining) => {
    const { years, months } = calculateTimeUntilRetirement(
      new Date(parseInt(dateOfJoining, 10)),
      ageAtJoining
    );
    return years === 0 && months < 6;
  };

  if (loading) return <><Header /><p>Loading...</p></>;

  const filteredEmployees = data?.getEmployees.filter((employee) => {
    if (upcomingRetired) {
      return isRetirementWithinSixMonths(employee.dateOfJoining, employee.age);
    }
    return true;
  });

  return (
    <>
      <Header />
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Employee List
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
          <FormControl variant="outlined" sx={{ width: '200px' }}>
            <InputLabel>Employee Type</InputLabel>
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              label="Employee Type"
              fullWidth
            >
              <MenuItem value="ALL">All Employees</MenuItem>
              <MenuItem value="FullTime">Full-Time</MenuItem>
              <MenuItem value="PartTime">Part-Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Seasonal">Seasonal</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Checkbox checked={upcomingRetired} onChange={handleCheckboxChange} />}
            label="Upcoming Retired"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Date of Joining</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Employee Type</TableCell>
                <TableCell>Current Status</TableCell>
                <TableCell>Retirement in Next 6 Months</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.age}</TableCell>
                  <TableCell>{formatDate(parseInt(employee.dateOfJoining))}</TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.employeeType}</TableCell>
                  <TableCell>{employee.currentStatus ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    {isRetirementWithinSixMonths(employee.dateOfJoining, employee.age) ? (
                      <span className="badge bg-warning text-dark">Yes</span>
                    ) : (
                      <span className="badge bg-success">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => navigate(`/${employee.id}/update`)}
                    >
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => navigate(`/${employee.id}/detail`)}
                    >
                      Info
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Footer />
    </>
  );
};

export default EmployeeTable;
