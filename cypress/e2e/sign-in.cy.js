// cypress/integration/signIn.spec.js

describe('SignIn Component Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5075/auth/sign-in'); // Replace with the actual URL where your SignIn component is rendered
    });

    it('should display and submit the form with valid credentials', () => {
        cy.get('input[name="userEmail"]').type('test4@test.com');
        cy.get('input[name="password"]').type('test123');
        cy.get('button[type="submit"]').click();

        // Assuming your toast messages have specific classes, you can assert their presence
        cy.get('.toast-success').should('be.visible');
    });

    it('should display an error message with invalid credentials', () => {
        cy.get('input[name="userEmail"]').type('invalid-email');
        cy.get('input[name="password"]').type('short');
        cy.get('button[type="submit"]').click();

        // Assuming your toast messages have specific classes, you can assert their presence
        cy.get('.toast-error').should('be.visible');
    });

    it('should handle Google social sign in', () => {
        cy.get('button:contains("Google")').click();

        // Assuming your social sign-in logic triggers a new window or redirects to Google authentication
        // You may need to handle this in your actual application and mock it in Cypress tests
        // Assert the presence of any elements indicating successful Google sign-in
        // cy.get('.google-sign-in-success').should('be.visible');
    });

    // Similar tests for Facebook and Github social sign-ins can be added

    it('should navigate to sign-up page when "Sign Up" link is clicked', () => {
        cy.contains('Don\'t have an account?').find('a').click();
        cy.url().should('include', '/auth/sign-up');
    });

    it('should navigate to forgot password page when "Forgot Password?" link is clicked', () => {
        cy.contains('Forgot Password?').find('a').click();
        cy.url().should('include', '/auth/forgot-password');
    });
});









