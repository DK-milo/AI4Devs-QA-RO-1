// Custom drag and drop implementation for react-beautiful-dnd
Cypress.Commands.add('dragAndDropRBD', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).should('exist')
  cy.get(targetSelector).should('exist')

  const BUTTON_INDEX = 0
  const SLOPPY_CLICK_THRESHOLD = 5

  cy.get(sourceSelector)
    .first()
    .then(subject => {
      const rect = subject[0].getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      cy.wrap(subject)
        .trigger('mousedown', {
          button: BUTTON_INDEX,
          clientX: x,
          clientY: y,
          force: true
        })
        .wait(100)

      cy.get(targetSelector)
        .first()
        .then(target => {
          const targetRect = target[0].getBoundingClientRect()
          const targetX = targetRect.left + targetRect.width / 2
          const targetY = targetRect.top + targetRect.height / 2

          cy.wrap(subject)
            .trigger('mousemove', {
              button: BUTTON_INDEX,
              clientX: targetX,
              clientY: targetY,
              force: true
            })
            .wait(100)

          cy.wrap(target)
            .trigger('mousemove', {
              button: BUTTON_INDEX,
              clientX: targetX,
              clientY: targetY,
              force: true
            })
            .trigger('mouseup', {
              force: true
            })
        })
    })
})