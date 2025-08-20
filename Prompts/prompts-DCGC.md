# Prompts for E2E Testing Implementation - Position Interface

## Phase 1: Setup and Configuration

### Step 1: Initialize Cypress Configuration
**Prompt:** "Create a Cypress configuration file (cypress.config.js) in the root directory with the following requirements:
- Set base URL to http://localhost:3000
- Configure viewport to 1280x720
- Set up e2e testing with specPattern for /cypress/e2e/**/*.cy.js
- Enable video recording and screenshots on failure
- Set default command timeout to 10000ms"

### Step 2: Create Cypress Folder Structure
**Prompt:** "Set up the complete Cypress folder structure:
- Create /cypress/e2e/ directory for test files
- Create /cypress/fixtures/ for test data
- Create /cypress/support/ for custom commands and utilities
- Initialize e2e.js support file with proper imports"

### Step 3: Setup Test Data and Custom Commands
**Prompt:** "Create Cypress fixtures and custom commands:
- Create position.json fixture with sample position data (id, title, stages)
- Create candidates.json fixture with sample candidate data
- Create custom commands for drag and drop operations using react-beautiful-dnd
- Add API interception utilities for mocking backend responses"

## Phase 2: Core Test Implementation

### Step 4: Implement Position Page Load Tests
**Prompt:** "Create position.cy.js test file with the following test cases:
- Test that navigating to /positions/1 loads the position page correctly
- Verify the position title is displayed prominently
- Check that all interview stage columns are rendered (use data-testid selectors)
- Validate that candidate cards appear in their respective columns
- Test the 'Volver a Posiciones' navigation button functionality"

### Step 5: Implement Drag and Drop Tests
**Prompt:** "Add drag and drop test scenarios to position.cy.js:
- Test dragging a candidate card from one column to another
- Verify visual feedback during drag operation (dragging state)
- Test successful drop operation and UI update
- Test invalid drop scenarios (dropping outside valid areas)
- Test dragging within the same column (no change expected)"

### Step 6: Implement Backend Integration Tests
**Prompt:** "Add API integration tests for candidate stage updates:
- Intercept PUT /candidates/:id API calls using cy.intercept()
- Verify correct payload is sent (applicationId, currentInterviewStep)
- Test successful API response handling and UI updates
- Test API error scenarios and error handling
- Validate that the candidate appears in the new column after successful update"

## Phase 3: Advanced Testing and Validation

### Step 7: Add Comprehensive Test Scenarios
**Prompt:** "Enhance the test suite with advanced scenarios:
- Test moving multiple candidates in sequence
- Test candidate card click functionality (opening details panel)
- Add tests for empty columns behavior
- Test responsive behavior on different viewport sizes
- Add accessibility tests for keyboard navigation and screen readers"

### Step 8: Setup Test Execution and Reporting
**Prompt:** "Configure test execution and documentation:
- Add Cypress scripts to package.json (cypress:open, cypress:run)
- Create test execution documentation in README
- Set up test reporting configuration
- Create guidelines for running tests in CI/CD environments
- Document test data requirements and setup procedures"

## Best Practices and Guidelines

### Selector Strategy
- Use data-testid attributes for reliable element selection
- Avoid using CSS classes or text content for selectors
- Create page object models for reusable element selectors

### API Testing
- Always intercept API calls for predictable testing
- Test both success and error scenarios
- Validate request payloads and response handling

### Drag and Drop Testing
- Use Cypress drag and drop plugin or custom commands
- Test visual feedback and intermediate states
- Validate both source and destination states

### Test Data Management
- Use fixtures for consistent test data
- Create helper functions for data setup
- Ensure tests are independent and can run in any order

### Error Handling
- Test network failures and API errors
- Validate user-friendly error messages
- Test recovery scenarios and retry mechanisms

## Execution Commands

```bash
# Install Cypress (if not already installed)
npm install --save-dev cypress

# Open Cypress Test Runner
npx cypress open

# Run tests in headless mode
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/position.cy.js"
```

## Success Criteria

- All tests pass consistently
- Tests cover happy path and error scenarios
- API integration is properly mocked and tested
- Drag and drop functionality works reliably
- Tests are maintainable and well-documented