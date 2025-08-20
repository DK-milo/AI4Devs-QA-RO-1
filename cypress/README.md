# E2E Testing for Position Interface

This directory contains End-to-End tests for the Position Interface using Cypress.

## Test Structure

```
cypress/
├── e2e/
│   └── position.cy.js          # Main position interface tests
├── fixtures/
│   ├── candidates.json         # Sample candidate data
│   └── interviewFlow.json      # Sample interview flow data
├── support/
│   ├── commands.js             # Custom Cypress commands
│   ├── dragDrop.js            # Drag and drop utilities
│   └── e2e.js                 # Support file configuration
└── README.md                   # This file
```

## Test Coverage

### 1. Page Load Verification
- ✅ Position title display
- ✅ Interview stage columns rendering
- ✅ Candidate cards in correct columns
- ✅ Candidate rating display
- ✅ Navigation functionality

### 2. Drag and Drop Functionality
- ✅ Candidate card dragging
- ✅ Moving candidates between columns
- ✅ Same column drag handling
- ✅ Visual feedback during drag operations

### 3. API Integration
- ✅ PUT /candidates/:id endpoint testing
- ✅ Correct payload validation
- ✅ Success response handling
- ✅ Error response handling
- ✅ Network failure scenarios

### 4. Edge Cases
- ✅ Empty columns behavior
- ✅ Invalid position handling
- ✅ Network failures
- ✅ Candidate details interaction

## Running Tests

### Prerequisites
1. Ensure both frontend and backend servers are running:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

2. Ensure test data is available in the database or API mocking is configured.

### Test Execution Commands

```bash
# Open Cypress Test Runner (Interactive)
npm run cypress:open

# Run all tests in headless mode
npm run cypress:run

# Run only position tests
npm run cypress:run:position

# Run tests with specific browser
npx cypress run --browser chrome

# Run tests and generate reports
npx cypress run --reporter mochawesome
```

## Test Data

The tests use fixtures located in `cypress/fixtures/`:

- **interviewFlow.json**: Contains sample interview flow with 4 stages
- **candidates.json**: Contains 4 sample candidates distributed across stages

## Custom Commands

### API Interception
```javascript
cy.interceptPositionApis(positionId)
```
Sets up API mocking for position-related endpoints.

### Drag and Drop
```javascript
cy.dragAndDropRBD(sourceSelector, targetSelector)
```
Performs drag and drop operations compatible with react-beautiful-dnd.

### API Waiting
```javascript
cy.waitForApi('@aliasName', timeout)
```
Waits for intercepted API calls with optional timeout.

## Configuration

The tests are configured in `cypress.config.js` with:
- Base URL: http://localhost:3000
- Viewport: 1280x720
- Default timeout: 10000ms
- Video recording enabled
- Screenshots on failure

## Troubleshooting

### Common Issues

1. **Drag and Drop Not Working**
   - Ensure react-beautiful-dnd is properly loaded
   - Check that elements have proper draggable attributes
   - Verify custom drag commands are imported

2. **API Calls Failing**
   - Confirm backend server is running on port 3010
   - Check API endpoint URLs match backend routes
   - Verify CORS configuration allows frontend requests

3. **Test Data Issues**
   - Ensure fixtures contain valid JSON
   - Check that candidate IDs match between fixtures
   - Verify interview flow structure matches backend schema

4. **Timing Issues**
   - Increase command timeout in cypress.config.js
   - Add explicit waits for API calls
   - Use cy.wait() for dynamic content loading

### Debug Mode

Run tests with debug information:
```bash
DEBUG=cypress:* npm run cypress:run
```

### Browser Developer Tools

When using `cypress:open`, you can:
1. Open browser developer tools
2. Set breakpoints in test code
3. Inspect element selectors
4. Monitor network requests

## Best Practices

1. **Selectors**: Use data-testid attributes when possible
2. **API Mocking**: Always intercept API calls for consistent testing
3. **Test Independence**: Each test should be able to run independently
4. **Error Handling**: Test both success and failure scenarios
5. **Documentation**: Keep tests well-documented and maintainable

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add appropriate fixtures for test data
3. Include both positive and negative test cases
4. Update this README with new test coverage
5. Ensure tests pass in both interactive and headless modes