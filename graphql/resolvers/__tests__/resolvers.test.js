const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const resolvers = require('../resolvers');
const Employee = require('../../../model/Employee');

let server;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

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
        firstName: String!
        lastName: String!
        age: String!
        dateOfJoining: String!
        title: Title!
        department: Department!
        employeeType: EmployeeType!
        currentStatus: Boolean!
      ): Employee

      updateEmployee(
        employeeId: ID!
        firstName: String
        lastName: String
        age: String
        dateOfJoining: String
        title: Title
        department: Department
        employeeType: EmployeeType
        currentStatus: Boolean!
      ): Employee

      deleteEmployee(id: ID!): Employee
    }
  `;

  server = new ApolloServer({ typeDefs, resolvers });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Employee.deleteMany({});
});

describe('Employee Resolvers', () => {
  it('creates a new employee successfully', async () => {
    const res = await server.executeOperation({
      query: gql`
        mutation {
          createEmployee(
            firstName: "Alice"
            lastName: "Smith"
            age: "30"
            dateOfJoining: "2023-01-01"
            title: Manager
            department: HR
            employeeType: FullTime
            currentStatus: true
          ) {
            firstName
            lastName
            currentStatus
            title
          }
        }
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createEmployee.firstName).toBe('Alice');
    expect(res.data.createEmployee.title).toBe('Manager');
  });

  it('fails to create employee with invalid age', async () => {
    const res = await server.executeOperation({
      query: gql`
        mutation {
          createEmployee(
            firstName: "Invalid"
            lastName: "User"
            age: "15"
            dateOfJoining: "2023-01-01"
            title: Employee
            department: IT
            employeeType: PartTime
            currentStatus: true
          ) {
            firstName
          }
        }
      `,
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toMatch(/Invalid age/);
  });

  it('fetches employee by ID', async () => {
    const newEmp = await Employee.create({
      firstName: "Mark",
      lastName: "Taylor",
      age: "40",
      dateOfJoining: "2022-02-02",
      title: "Director",
      department: "Marketing",
      employeeType: "Contract",
      currentStatus: true,
    });

    const res = await server.executeOperation({
      query: gql`
        query GetEmployee($id: ID!) {
          getEmployee(id: $id) {
            firstName
            title
            department
          }
        }
      `,
      variables: { id: newEmp._id.toString() },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.getEmployee.firstName).toBe("Mark");
    expect(res.data.getEmployee.title).toBe("Director");
  });

  it('updates employee details', async () => {
    const emp = await Employee.create({
      firstName: "Sam",
      lastName: "Roy",
      age: "45",
      dateOfJoining: "2021-08-08",
      title: "Employee",
      department: "Engineering",
      employeeType: "Seasonal",
      currentStatus: true,
    });

    const res = await server.executeOperation({
      query: gql`
        mutation {
          updateEmployee(
            employeeId: "${emp._id}"
            firstName: "Sam"
            lastName: "Roy"
            age: "45"
            dateOfJoining: "2021-08-08"
            title: VP
            department: Marketing
            employeeType: Seasonal
            currentStatus: false
          ) {
            title
            department
            currentStatus
          }
        }
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.updateEmployee.title).toBe("VP");
    expect(res.data.updateEmployee.currentStatus).toBe(false);
  });
});
