const { gql } = require('apollo-server-express');

// Feedback: Enum type not used for Title, Employee type and Department in graphQL
// Added now

const typeDefs = gql`
  enum EmployeeType {
    ALL
    FullTime
    PartTime
    Contract
    Seasonal
  }

  enum Department {
    IT
    Marketing
    HR
    Engineering
  }

  enum Title {
    Employee
    Manager
    Director
    VP
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    age: String!
    dateOfJoining: String!
    title: Title!
    department: Department!
    employeeType: EmployeeType!
    currentStatus: Boolean!
  }

  type Query {
    getEmployees(employeeType: EmployeeType): [Employee]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    createEmployee(
      firstName: String!,
      lastName: String!,
      age: String!,
      dateOfJoining: String!,
      title: Title!,
      department: Department!,
      employeeType: EmployeeType!,
      currentStatus: Boolean!
    ): Employee
    
    updateEmployee(
      employeeId: ID!,
      firstName: String,
      lastName: String,
      age: String,
      dateOfJoining: String,
      title: Title,
      department: Department,
      employeeType: EmployeeType,
      currentStatus: Boolean!
    ): Employee

    deleteEmployee(id: ID!): Employee
  }
`;

module.exports = typeDefs;
