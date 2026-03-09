describe('Authentification', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('affiche le formulaire de connexion pour un utilisateur non authentifié', () => {
    cy.get('form').should('be.visible')
    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
  })

  it('connecte un utilisateur avec des identifiants valides', () => {
    cy.fixture('user').then((user) => {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('button[type="submit"]').click()

      // Après login, on doit voir la liste des tâches
      cy.contains('Todo List').should('be.visible')
      cy.contains('Déconnexion').should('be.visible')
    })
  })

  it('affiche une erreur avec des identifiants invalides', () => {
    cy.get('#username').type('mauvais_user')
    cy.get('#password').type('mauvais_mdp')
    cy.get('button[type="submit"]').click()

    cy.get('[role="alert"]').should('contain', 'Identifiants invalides')
  })

  it('déconnecte l\'utilisateur', () => {
    cy.fixture('user').then((user) => {
      cy.loginByApi(user.username, user.password)
      cy.visit('/')
      cy.contains('Déconnexion').click()
      cy.get('form').should('be.visible')
    })
  })
})
