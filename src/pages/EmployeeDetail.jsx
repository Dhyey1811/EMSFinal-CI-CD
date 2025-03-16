import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { calculateTimeUntilRetirement } from '../utils/calculateRetirementTime';
import { Container, Card, CardContent, Typography, Grid, Box } from '@mui/material';

// Define the GraphQL query to get the employee data
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

const EmployeeDetail = () => {
  const { id } = useParams(); // Get employee ID from the URL params
  const { loading, error, data } = useQuery(GET_EMPLOYEE, { variables: { id } }); // Fetch employee data from GraphQL API

  const [retired, setRetired] = useState(false);
  const [retirementInfo, setRetirementInfo] = useState({ years: 0, months: 0, days: 0 });

  // Calculate retirement information when data is fetched
  useEffect(() => {
    if (data?.getEmployee) {
      const employee = data.getEmployee;
      const ageAtJoining = parseInt(employee?.age, 10);
      const joiningDate = new Date(parseInt(employee?.dateOfJoining, 10));
      const { years, months, days } = calculateTimeUntilRetirement(joiningDate, ageAtJoining);

      if (years <= 0) {
        setRetired(true);
      } else {
        setRetirementInfo({ years, months, days });
      }
    }
  }, [data]);

  // Handle loading and error states
  if (loading) return <div className="text-center py-5"><span className="ms-2">Loading...</span></div>;
  if (error) return <div className="text-center py-5"><span className="ms-2">Error loading employee data</span></div>;

  const employee = data?.getEmployee;

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            {employee ? (
              <>
                <Typography variant="h4" component="div" color="primary" gutterBottom sx={{ textAlign: 'center' }}>
                  Employee Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ backgroundColor: '#f7f7f7', padding: 2, borderRadius: 1 }}>
                      <Typography variant="body1"><strong>First Name:</strong> {employee.firstName}</Typography>
                      <Typography variant="body1"><strong>Last Name:</strong> {employee.lastName}</Typography>
                      <Typography variant="body1"><strong>Age:</strong> {employee.age}</Typography>
                      <Typography variant="body1"><strong>Title:</strong> {employee.title}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ backgroundColor: '#f7f7f7', padding: 2, borderRadius: 1 }}>
                      <Typography variant="body1"><strong>Department:</strong> {employee.department}</Typography>
                      <Typography variant="body1"><strong>Employee Type:</strong> {employee.employeeType}</Typography>
                      <Typography variant="body1"><strong>Date of Joining:</strong> {new Date(parseInt(employee.dateOfJoining)).toLocaleDateString()}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ marginTop: 4 }}>
                  <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
                    Retirement Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ backgroundColor: '#f7f7f7', padding: 2, borderRadius: 1 }}>
                        {retired ? (
                          <>
                            <Typography variant="body1"><strong>Retired: </strong> Yes</Typography>
                            <Typography variant="body1"><strong>Age:</strong> {employee.age}</Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body1"><strong>Years until Retirement:</strong> {retirementInfo.years}</Typography>
                            <Typography variant="body1"><strong>Months until Retirement:</strong> {retirementInfo.months} months</Typography>
                            <Typography variant="body1"><strong>Days until Retirement:</strong> {retirementInfo.days} days</Typography>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <Typography variant="body1">Employee not found.</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default EmployeeDetail;
