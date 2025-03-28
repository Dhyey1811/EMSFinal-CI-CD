import { calculateTimeUntilRetirement } from '../calculateRetirementTime';

describe('calculateTimeUntilRetirement', () => {
  beforeEach(() => {
    // Freeze system time to 2024-01-01 for consistent results
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns full time until retirement for a new employee', () => {
    const joiningDate = new Date('2024-01-01'); // Age 25 on Jan 1, 2024
    const result = calculateTimeUntilRetirement(joiningDate, 25);

    expect(result.years).toBe(40); // 65 - 25
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  test('returns 0 years if already 65 at joining', () => {
    const joiningDate = new Date('2024-01-01');
    const result = calculateTimeUntilRetirement(joiningDate, 65);

    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  test('returns correct time when joining date is in the past', () => {
    const joiningDate = new Date('2010-01-01'); // Joined 14 years ago at age 30
    const result = calculateTimeUntilRetirement(joiningDate, 30);

    expect(result.years).toBe(21); // 35 - (2024 - 2010) = 21
  });

  test('handles end-of-month edge cases correctly', () => {
    const joiningDate = new Date('2020-01-31');
    const result = calculateTimeUntilRetirement(joiningDate, 30);

    expect(result.years).toBe(31); // Retirement in 2055, today is 2024
    expect(result.months).toBeLessThanOrEqual(11);
    expect(result.days).toBeGreaterThanOrEqual(0);
  });

  test('returns 0 for all values if retirement is today', () => {
    const joiningDate = new Date('2024-01-01');
    const result = calculateTimeUntilRetirement(joiningDate, 65);

    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });
});
