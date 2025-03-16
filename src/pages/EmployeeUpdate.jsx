import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, FormHelperText } from '@mui/material';

// Feedback: Dotenv package is not used for storing sensitive info
// Added now

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $employeeId: ID!,
    $firstName: String!,
    $lastName: String!,
    $age: String!,
    $dateOfJoining: String!,
    $title: Title!,
    $department: Department!,
    $employeeType: EmployeeType!,
    $currentStatus: Boolean!
  ) {
    updateEmployee(
      employeeId: $employeeId,
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

const EmployeeUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfJoining: '',
    title: 'Employee',
    department: 'IT',
    employeeType: 'FullTime',
    currentStatus: true, 
    employeeId: id,
  });

  const [validationErrors, setValidationErrors] = useState({});
  
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_EMPLOYEE, {
    variables: { id },
  });

  useEffect(() => {
    if (data) {
      setEmployee({ ...data.getEmployee, employeeId: id });
    }
  }, [data, queryError, id]);

  const [updateEmployee, { loading, error }] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => navigate('/'),
    onError: (err) => console.log(JSON.stringify(err, null, 2)),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Feedback: The React State with callback method should have been used to update the from state as the current state of the form depends on the previous state.
    // Done
      if (name === 'currentStatus') {
        console.log(name, value, value===true);
      
        setEmployee((prevState) => ({
          ...prevState,
          [name]: name === 'currentStatus' ? value === 'true' : value,
        }));
      } else {
        setEmployee((prevState) => ({
          ...prevState,
          [name]: value, 
        }));
      }
    
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    };
  

  const validateForm = () => {
    const errors = {};
    if (!employee.firstName) errors.firstName = 'First Name is required.';
    if (!employee.lastName) errors.lastName = 'Last Name is required.';
    if (!employee.age) errors.age = 'Age must be between valid';
    if (!employee.dateOfJoining) errors.dateOfJoining = 'Date of Joining is required.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateEmployee({ variables: {...employee,currentStatus: Boolean(employee.currentStatus)} });
    }
  };

  if(queryLoading) return <>
    <Header /><p>Loading</p>
  </>

  return (
    <>
      <Header />
      <div className="container d-flex flex-column align-items-center my-5">
        <h2>Update Employee</h2>
        <form onSubmit={handleSubmit} className="p-4 border rounded" style={{ maxWidth: '600px', width: '100%' }}>
          <TextField
            label="First Name"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
            error={!!validationErrors.firstName}
            helperText={validationErrors.firstName}
          />
          
          <TextField
            label="Last Name"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
            error={!!validationErrors.lastName}
            helperText={validationErrors.lastName}
          />
          
          <TextField
            label="Age"
            name="age"
            type="number"
            value={employee.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
            error={!!validationErrors.age}
            helperText={validationErrors.age}
          />
          
          <TextField
            label="Date of Joining"
            name="dateOfJoining"
            type="date"
            value={employee.dateOfJoining}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
            error={!!validationErrors.dateOfJoining}
            helperText={validationErrors.dateOfJoining}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Title</InputLabel>
            <Select
              name="title"
              value={employee.title}
              onChange={handleChange}
            >
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Director">Director</MenuItem>
              <MenuItem value="VP">VP</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={employee.department}
              onChange={handleChange}
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Employee Type</InputLabel>
            <Select
              name="employeeType"
              value={employee.employeeType}
              onChange={handleChange}
              disabled
            >
              <MenuItem value="FullTime">FullTime</MenuItem>
              <MenuItem value="PartTime">PartTime</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Seasonal">Seasonal</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="currentStatus"
                value={employee.currentStatus.toString()} 
                onChange={handleChange} 
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>


          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Update Employee
          </Button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EmployeeUpdate;
