const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Employee = require('../../model/Employee');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Employee.deleteMany({});
});

describe('Employee Model Unit Tests', () => {
  it('should save a valid employee', async () => {
    const employee = new Employee({
      firstName: 'Alice',
      lastName: 'Johnson',
      age: '32',
      dateOfJoining: new Date('2022-06-01'),
      title: 'Manager',
      department: 'HR',
      employeeType: 'FullTime',
      currentStatus: true,
    });

    const savedEmployee = await employee.save();
    expect(savedEmployee._id).toBeDefined();
    expect(savedEmployee.firstName).toBe('Alice');
    expect(savedEmployee.title).toBe('Manager');
  });

  it('should fail with an invalid title', async () => {
    const invalidEmployee = new Employee({
      firstName: 'Bob',
      lastName: 'Smith',
      age: '29',
      dateOfJoining: new Date('2022-01-15'),
      title: 'Intern', // ❌ Not allowed in enum
      department: 'Marketing',
      employeeType: 'PartTime',
      currentStatus: true,
    });

    let err;
    try {
      await invalidEmployee.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors['title']).toBeDefined();
    expect(err.errors['title'].message).toContain('Intern is not a valid enum value');
  });

  it('should fail if required field is missing', async () => {
    const employee = new Employee({
      lastName: 'Singh', // First name missing
      age: '35',
      dateOfJoining: new Date('2021-11-01'),
      title: 'Director',
      department: 'IT',
      employeeType: 'FullTime',
      currentStatus: true,
    });

    let err;
    try {
      await employee.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors['firstName']).toBeDefined();
    expect(err.errors['firstName'].message).toBe('Path firstName is required.');
  });
});