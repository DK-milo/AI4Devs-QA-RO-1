// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for drag and drop with react-beautiful-dnd
Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).should('be.visible')
  cy.get(targetSelector).should('be.visible')
  
  // Get the source element
  cy.get(sourceSelector).then(($source) => {
    const sourceRect = $source[0].getBoundingClientRect()
    
    // Get the target element
    cy.get(targetSelector).then(($target) => {
      const targetRect = $target[0].getBoundingClientRect()
      
      // Perform drag and drop
      cy.get(sourceSelector)
        .trigger('mousedown', {
          button: 0,
          clientX: sourceRect.x + sourceRect.width / 2,
          clientY: sourceRect.y + sourceRect.height / 2
        })
        .wait(100)
      
      cy.get(targetSelector)
        .trigger('mousemove', {
          clientX: targetRect.x + targetRect.width / 2,
          clientY: targetRect.y + targetRect.height / 2
        })
        .trigger('mouseup')
    })
  })
})

// Custom command to wait for API calls
Cypress.Commands.add('waitForApi', (alias, timeout = 10000) => {
  cy.wait(alias, { timeout })
})

// Custom command to intercept position API calls
Cypress.Commands.add('interceptPositionApis', (positionId = 1) => {
  // Intercept position interview flow
  cy.intercept('GET', `/positions/${positionId}/interviewFlow`, {
    fixture: 'interviewFlow.json'
  }).as('getInterviewFlow')
  
  // Intercept position candidates
  cy.intercept('GET', `/positions/${positionId}/candidates`, {
    fixture: 'candidates.json'
  }).as('getCandidates')
  
  // Intercept candidate update
  cy.intercept('PUT', '/candidates/*', {
    statusCode: 200,
    body: { message: 'Candidate updated successfully' }
  }).as('updateCandidate')
})