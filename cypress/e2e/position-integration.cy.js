describe('Position Interface - Full Integration Test', () => {
  const positionId = 1

  beforeEach(() => {
    // Setup realistic API responses
    cy.intercept('GET', `/positions/${positionId}/interviewFlow`, {
      fixture: 'interviewFlow.json'
    }).as('getInterviewFlow')
    
    cy.intercept('GET', `/positions/${positionId}/candidates`, {
      fixture: 'candidates.json'
    }).as('getCandidates')
  })

  it('should complete a full candidate journey through interview stages', () => {
    // Visit position page
    cy.visit(`/positions/${positionId}`)
    
    // Wait for page to load
    cy.wait('@getInterviewFlow')
    cy.wait('@getCandidates')
    
    // Verify initial state
    cy.get('h2').should('contain.text', 'Senior Frontend Developer')
    
    // Step 1: Move Juan Pérez from Initial Screening to Technical Interview
    cy.intercept('PUT', '/candidates/1', {
      statusCode: 200,
      body: { message: 'Updated to Technical Interview' }
    }).as('moveToTechnical')
    
    cy.get('.col-md-3').eq(0).within(() => {
      cy.get('.card').contains('Juan Pérez').as('juanCard')
    })
    
    cy.get('.col-md-3').eq(1).find('.card-body').as('technicalColumn')
    
    // Simulate drag and drop
    cy.get('@juanCard').trigger('dragstart', { dataTransfer: new DataTransfer() })
    cy.get('@technicalColumn').trigger('dragover')
    cy.get('@technicalColumn').trigger('drop')
    
    cy.wait('@moveToTechnical').then((interception) => {
      expect(interception.request.body).to.deep.include({
        applicationId: 101,
        currentInterviewStep: 2
      })
    })
    
    // Step 2: Move Carlos López from Technical to Final Interview
    cy.intercept('PUT', '/candidates/3', {
      statusCode: 200,
      body: { message: 'Updated to Final Interview' }
    }).as('moveToFinal')
    
    cy.get('.col-md-3').eq(1).within(() => {
      cy.get('.card').contains('Carlos López').as('carlosCard')
    })
    
    cy.get('.col-md-3').eq(2).find('.card-body').as('finalColumn')
    
    cy.get('@carlosCard').trigger('dragstart', { dataTransfer: new DataTransfer() })
    cy.get('@finalColumn').trigger('dragover')
    cy.get('@finalColumn').trigger('drop')
    
    cy.wait('@moveToFinal')
    
    // Step 3: Move Ana Martínez from Final Interview to Offer
    cy.intercept('PUT', '/candidates/4', {
      statusCode: 200,
      body: { message: 'Updated to Offer' }
    }).as('moveToOffer')
    
    cy.get('.col-md-3').eq(2).within(() => {
      cy.get('.card').contains('Ana Martínez').as('anaCard')
    })
    
    cy.get('.col-md-3').eq(3).find('.card-body').as('offerColumn')
    
    cy.get('@anaCard').trigger('dragstart', { dataTransfer: new DataTransfer() })
    cy.get('@offerColumn').trigger('dragover')
    cy.get('@offerColumn').trigger('drop')
    
    cy.wait('@moveToOffer')
    
    // Verify final state - all candidates have moved
    cy.get('.col-md-3').eq(0).within(() => {
      cy.get('.card').should('have.length', 1) // Only María García remains
      cy.get('.card-title').should('contain.text', 'María García')
    })
    
    cy.get('.col-md-3').eq(1).within(() => {
      cy.get('.card').should('have.length', 1) // Juan Pérez moved here
      cy.get('.card-title').should('contain.text', 'Juan Pérez')
    })
    
    cy.get('.col-md-3').eq(2).within(() => {
      cy.get('.card').should('have.length', 1) // Carlos López moved here
      cy.get('.card-title').should('contain.text', 'Carlos López')
    })
    
    cy.get('.col-md-3').eq(3).within(() => {
      cy.get('.card').should('have.length', 1) // Ana Martínez moved here
      cy.get('.card-title').should('contain.text', 'Ana Martínez')
    })
  })

  it('should handle multiple rapid candidate movements', () => {
    cy.visit(`/positions/${positionId}`)
    cy.wait('@getInterviewFlow')
    cy.wait('@getCandidates')
    
    // Setup multiple API intercepts
    cy.intercept('PUT', '/candidates/1', { statusCode: 200, body: { message: 'Success' } }).as('update1')
    cy.intercept('PUT', '/candidates/2', { statusCode: 200, body: { message: 'Success' } }).as('update2')
    
    // Move multiple candidates quickly
    cy.get('.col-md-3').eq(0).find('.card').contains('Juan Pérez').as('juan')
    cy.get('.col-md-3').eq(0).find('.card').contains('María García').as('maria')
    cy.get('.col-md-3').eq(1).find('.card-body').as('techColumn')
    
    // First movement
    cy.get('@juan').trigger('dragstart', { dataTransfer: new DataTransfer() })
    cy.get('@techColumn').trigger('dragover')
    cy.get('@techColumn').trigger('drop')
    
    // Second movement immediately after
    cy.get('@maria').trigger('dragstart', { dataTransfer: new DataTransfer() })
    cy.get('@techColumn').trigger('dragover')
    cy.get('@techColumn').trigger('drop')
    
    // Verify both API calls were made
    cy.wait('@update1')
    cy.wait('@update2')
  })

  it('should maintain UI consistency during network delays', () => {
    cy.visit(`/positions/${positionId}`)
    cy.wait('@getInterviewFlow')
    cy.wait('@getCandidates')
    
    // Setup delayed API response
    cy.intercept('PUT', '/candidates/1', (req) => {
      req.reply((res) => {
        res.delay(2000) // 2 second delay
        res.send({ statusCode: 200, body: { message: 'Success' } })
      })
    }).as('delayedUpdate')
    
    // Perform drag and drop
    cy.get('.col-md-3').eq(0).find('.card').contains('Juan Pérez').as('juan')
    cy.get('.col-md-3').eq(1).find('.card-body').as('techColumn')
    
    cy.get('@juan').trigger('dragstart', { dataTransfer: new DataTransfer() })
    cy.get('@techColumn').trigger('dragover')
    cy.get('@techColumn').trigger('drop')
    
    // Verify UI updates immediately (optimistic update)
    cy.get('.col-md-3').eq(1).should('contain.text', 'Juan Pérez')
    
    // Wait for API call to complete
    cy.wait('@delayedUpdate')
    
    // Verify UI remains consistent
    cy.get('.col-md-3').eq(1).should('contain.text', 'Juan Pérez')
  })
})