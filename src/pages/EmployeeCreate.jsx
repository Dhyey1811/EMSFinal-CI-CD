import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Container, Box, Typography } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $firstName: String!, 
    $lastName: String!, 
    $age: String!, 
    $dateOfJoining: String!, 
    $title: Title!, 
    $department: Department!, 
    $employeeType: EmployeeType!, 
    $currentStatus: Boolean!
  ) {
    createEmployee(
      firstName: $firstName, 
      lastName: $lastName, 
      age: $age, 
      dateOfJoining: $dateOfJoining, 
      title: $title, 
      department: $department, 
      employeeType: $employeeType, 
      currentStatus: $currentStatus
    ) {
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

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfJoining: '',
    title: 'Employee',
    department: 'IT',
    employeeType: 'FullTime',
    currentStatus: true,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const [createEmployee, { loading }] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => navigate('/'),
    onError: (error) => console.log(JSON.stringify(error, null, 2)),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee({
      ...employee,
      [name]: name === 'currentStatus' ? value === 'true' : value,
    });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!employee.firstName) errors.firstName = 'First Name is required';
    if (!employee.lastName) errors.lastName = 'Last Name is required';
    if (!employee.age || employee.age <= 0) errors.age = 'Valid Age is required';
    if (!employee.dateOfJoining) errors.dateOfJoining = 'Date of Joining is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }


    createEmployee({ variables: { ...employee, currentStatus: Boolean(employee.currentStatus) } });
    setEmployee({
      firstName: '',
      lastName: '',
      age: '',
      dateOfJoining: '',
      title: 'Employee',
      department: 'IT',
      employeeType: 'FullTime',
      currentStatus: true,
    });
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ my: 5 }}>
        <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Add New Employee
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              variant="outlined"
              value={employee.firstName}
              onChange={handleChange}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              variant="outlined"
              value={employee.lastName}
              onChange={handleChange}
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              variant="outlined"
              value={employee.age}
              onChange={handleChange}
              error={!!validationErrors.age}
              helperText={validationErrors.age}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              variant="outlined"
              value={employee.dateOfJoining}
              onChange={handleChange}
              error={!!validationErrors.dateOfJoining}
              helperText={validationErrors.dateOfJoining}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Title</InputLabel>
              <Select
                name="title"
                value={employee.title}
                onChange={handleChange}
                label="Title"
              >
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Director">Director</MenuItem>
                <MenuItem value="VP">VP</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={employee.department}
                onChange={handleChange}
                label="Department"
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Employee Type</InputLabel>
              <Select
                name="employeeType"
                value={employee.employeeType}
                onChange={handleChange}
                label="Employee Type"
              >
                <MenuItem value="FullTime">FullTime</MenuItem>
                <MenuItem value="PartTime">PartTime</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Seasonal">Seasonal</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Current Status</InputLabel>
              <Select
                name="currentStatus"
                value={employee.currentStatus}
                onChange={handleChange}
                label="Current Status"
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Adding Employee...' : 'Add Employee'}
            </Button>
          </form>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default EmployeeCreate;

