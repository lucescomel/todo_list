/**
 * Commande personnalisée : login via API (bypass UI pour les tests qui ne testent pas le login)
 * Injecte directement les tokens JWT dans le localStorage.
 */
Cypress.Commands.add('loginByApi', (username = 'testuser', password = 'testpass123') => {
  cy.request('POST', 'http://127.0.0.1:8000/api/auth/token/', { username, password }).then(
    (response) => {
      window.localStorage.setItem('access_token', response.body.access)
      window.localStorage.setItem('refresh_token', response.body.refresh)
    }
  )
})

/**
 * Commande personnalisée : créer une tâche via API (setup de données de test rapide)
 */
Cypress.Commands.add('createTask', (title, category = 'travail') => {
  const token = window.localStorage.getItem('access_token')
  cy.request({
    method: 'POST',
    url: 'http://127.0.0.1:8000/api/tasks/',
    headers: { Authorization: `Bearer ${token}` },
    body: { title, category },
  })
})