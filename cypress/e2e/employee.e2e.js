describe('Employee Management E2E Test', () => {
    beforeEach(() => {
      // Register GraphQL alias and visit home page
      cy.intercept('POST', '**/graphql').as('graphql');
      cy.visit('/');
      cy.wait('@graphql');
    });
  
    it('should load home and navigate to create page', () => {
      cy.contains('Employee List', { timeout: 10000 }).should('exist');
      cy.contains('Create Employee').click();
      cy.url().should('include', '/create');
    });
  
    it('should fill form and create employee', () => {
      cy.visit('/create');
  
      cy.get('input[name="firstName"]', { timeout: 10000 }).should('be.visible');
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="age"]').type('35');
      cy.get('input[name="dateOfJoining"]').type('2023-01-01');
  
      cy.get('div.MuiFormControl-root:contains("Title")').click();
      cy.contains('Manager').click();
  
      cy.get('div.MuiFormControl-root:contains("Department")').click();
      cy.contains('HR').click();
  
      cy.get('div.MuiFormControl-root:contains("Employee Type")').click();
      cy.contains('FullTime').click();
  
      cy.get('div.MuiFormControl-root:contains("Current Status")').click();
      cy.contains('Active').click();
  
      cy.contains('Add Employee').click();
      cy.wait('@graphql'); // Wait for mutation request
  
      cy.url().should('eq', 'http://localhost:3000/');
    });
  
    it('should show newly added employee in the list', () => {
      cy.contains('John').should('exist');
      cy.contains('Doe').should('exist');
    });
  
    it('should navigate to detail page', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Info').click();
      });
  
      cy.contains('Employee Details').should('exist');
      cy.contains('Retirement Information').should('exist');
    });
  
    it('should update employee status to Inactive', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Update').click();
      });
  
      cy.url().should('include', '/update');
  
      cy.get('div.MuiFormControl-root:contains("Status")').click();
      cy.contains('Inactive').click();
  
      cy.contains('Update Employee').click();
      cy.wait('@graphql'); // Wait for update mutation
  
      cy.url().should('eq', 'http://localhost:3000/');
    });
  
    it('should delete the employee', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Delete').click();
      });
  
      cy.on('window:confirm', () => true); // Accept confirmation
  
      cy.wait('@graphql'); // Wait for delete mutation
  
      cy.contains('John').should('not.exist');
    });
  });
  