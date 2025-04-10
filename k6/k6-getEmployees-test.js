import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,              // 10 virtual users
  duration: '15s',      // run for 15 seconds
};

export default function () {
  const url = 'http://localhost:8000/graphql';

  const query = `
    query GetEmployees($employeeType: EmployeeType) {
      getEmployees(employeeType: $employeeType) {
        id
        firstName
        lastName
        age
      }
    }
  `;

  const payload = JSON.stringify({
    query,
    variables: {
      employeeType: "ALL"
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'no GraphQL errors': (r) => !r.json().errors,
  });

  sleep(1); // wait 1 second between requests
}
