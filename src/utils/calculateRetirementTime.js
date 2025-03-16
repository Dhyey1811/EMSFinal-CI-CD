export const calculateTimeUntilRetirement = (joiningDate, ageAtJoining) => {
    const RETIREMENT_AGE = 65;
    const retirementDate = new Date(joiningDate.setFullYear(joiningDate.getFullYear() + (RETIREMENT_AGE - ageAtJoining)));
  
    const today = new Date();
  
    let years = retirementDate.getFullYear() - today.getFullYear();
    let months = retirementDate.getMonth() - today.getMonth();
    let days = retirementDate.getDate() - today.getDate();
  
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    }
  
    if (months < 0) {
      years--;
      months += 12;
    }
  
    return { years, months, days };
  };
  