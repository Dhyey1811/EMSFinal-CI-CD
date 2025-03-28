describe('Employee Management E2E Test', () => {
  beforeEach(() => {
    // Intercept GraphQL and visit the home page
    cy.intercept('POST', '**/graphql').as('graphql');
    cy.visit('/');
    cy.wait('@graphql');
  });

  it('should load home and navigate to create page', () => {
    cy.contains('Employee List', { timeout: 10000 }).should('exist');
    cy.contains('Create Employee').click({ force: true });
    cy.url().should('include', '/create');
  });

  it('should fill form and create employee', () => {
    cy.visit('/create');

    cy.get('input[name="firstName"]', { timeout: 10000 }).should('be.visible').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="age"]').type('35');
    cy.get('input[name="dateOfJoining"]').type('2023-01-01');

    // Title
    cy.get('#mui-component-select-title').click({ force: true });
    cy.get('ul[role="listbox"]').should('be.visible');
    cy.contains('li', 'Manager').click();

    // Department
    cy.get('#mui-component-select-department').click({ force: true });
    cy.get('ul[role="listbox"]').should('be.visible');
    cy.contains('li', 'HR').click();

    // Employee Type
    cy.get('#mui-component-select-employeeType').click({ force: true });
    cy.get('ul[role="listbox"]').should('be.visible');
    cy.contains('li', 'FullTime').click();

    // Current Status
    cy.get('#mui-component-select-currentStatus').click({ force: true });
    cy.get('ul[role="listbox"]').should('be.visible');
    cy.contains('li', 'Active').click();

    cy.contains('Add Employee').click();
    cy.wait('@graphql'); // Wait for mutation

    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('should show newly added employee in the list', () => {
    cy.contains('John', { timeout: 10000 }).should('exist');
    cy.contains('Doe').should('exist');
  });

  it('should navigate to detail page', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Info').click();
    });

    cy.contains('Employee Details').should('exist');
    cy.contains('Retirement Information').should('exist');
  });

  it('should delete the employee', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Delete').click();
    });

    cy.on('window:confirm', () => true); // Accept confirmation
    cy.wait('@graphql'); // Wait for deletion

    cy.contains('John').should('not.exist');
  });
});
