const Employee = require('../../model/Employee');
const { ApolloError } = require('apollo-server');

const resolvers = {
  Query: {
    getEmployees: async (_, { employeeType }) => {
      const filter = {};
      if (employeeType!="ALL") {
        filter.employeeType = employeeType;
      }
      return await Employee.find(filter);
    },
    getEmployee: async (_, { id }) => {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new ApolloError('Employee not found', 'NOT_FOUND');
      }
      return employee;
    }
  },
  Mutation: {
    createEmployee: async (_, { firstName, lastName, age, dateOfJoining, title, department, employeeType, currentStatus }) => {
      console.log(firstName, lastName, age, dateOfJoining, title, department, employeeType, currentStatus)

      //Feedback: No/very little employee validation on the server side
      // Added now
    
      if (!firstName || firstName.trim().length === 0) {
        throw new Error("First name cannot be empty.");
      }
  
      if (!lastName || lastName.trim().length === 0) {
        throw new Error("Last name cannot be empty.");
      }
  
      if (!age || parseInt(age) < 18 || parseInt(age) > 65) {
        throw new Error("Invalid age. It must be a number between 18 and 65.");
      }
  
      const parsedDate = new Date(dateOfJoining);
      if (!dateOfJoining || isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date of joining. It must be a valid date.");
      }
  
      if (currentStatus !== true && currentStatus !== false) {
        throw new Error("Invalid current status. It must be either true or false.");
      }
      const newEmployee = new Employee({
        firstName,
        lastName,
        age,
        dateOfJoining,
        title,
        department,
        employeeType,
        currentStatus
      });
      return await newEmployee.save();
    },
    updateEmployee: async (_, { employeeId, currentStatus, firstName, lastName, age, dateOfJoining, title, department, employeeType }) => {
      console.log(currentStatus, typeof currentStatus);
      if (!employeeId) {
        throw new ApolloError('Employee ID is required', 'VALIDATION_ERROR');
      }
      if (!title || !department) {
        throw new ApolloError('All fields are required', 'VALIDATION_ERROR');
      }
      
      // No need as we are not upadting age

      // if (isNaN(age) || age < 18) {
      //   throw new ApolloError('Age must be a number and at least 18', 'VALIDATION_ERROR');
      // }
      
      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        {
          firstName,
          lastName,
          age,
          dateOfJoining,
          title,
          department,
          employeeType,
          currentStatus
        },
        { new: true }
      );
      return updatedEmployee;
    },
    
  },
};

module.exports = resolvers;
