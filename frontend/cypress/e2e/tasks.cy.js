/**
 * Parcours E2E critique : "Création et filtrage d'une tâche"
 * Tel que défini dans le TP Liora — Partie 3
 */
describe('Parcours : Création et filtrage d\'une tâche', () => {
  beforeEach(() => {
    cy.fixture('user').then((user) => {
      cy.loginByApi(user.username, user.password)
    })
    cy.visit('/')
  })

  it('connecte l\'utilisateur et affiche la liste des tâches', () => {
    cy.contains('Todo List').should('be.visible')
    cy.get('[aria-label="Ajouter une tâche"]').should('exist')
  })

  it('crée une nouvelle catégorie de tâche et la voit dans la liste', () => {
    const taskTitle = `Projet Alpha ${Date.now()}`

    cy.get('[aria-label="Titre de la tâche"]').type(taskTitle)
    cy.get('[aria-label="Catégorie"]').select('Travail')
    cy.contains('button', 'Ajouter').click()

    // La tâche doit apparaître dans la liste
    cy.contains(taskTitle).should('be.visible')
    cy.contains('Travail').should('be.visible')
  })

  it('applique un filtre par catégorie — "Déployer la VT" devient visible', () => {
    const taskTravail = `Déployer la VT ${Date.now()}`
    const taskPerso = `Lire un livre ${Date.now()}`

    // Créer les deux tâches via API (setup rapide)
    cy.createTask(taskTravail, 'travail')
    cy.createTask(taskPerso, 'perso')
    cy.reload()

    // Filtrer par "Travail"
    cy.contains('button', 'Travail').click()

    cy.contains(taskTravail).should('be.visible')
    cy.contains(taskPerso).should('not.exist')
  })

  it('marque une tâche comme terminée — son apparence change', () => {
    const taskTitle = `Tâche à terminer ${Date.now()}`
    cy.createTask(taskTitle, 'travail')
    cy.reload()

    cy.contains(taskTitle)
      .closest('[data-testid="task-item"]')
      .find('input[type="checkbox"]')
      .click()

    cy.contains(taskTitle).should('have.css', 'text-decoration-line', 'line-through')
  })

  it('supprime une tâche — elle disparaît de la liste', () => {
    const taskTitle = `Tâche à supprimer ${Date.now()}`
    cy.createTask(taskTitle, 'autre')
    cy.reload()

    cy.contains(taskTitle)
      .closest('[data-testid="task-item"]')
      .find('button[aria-label*="Supprimer"]')
      .click()

    cy.contains(taskTitle).should('not.exist')
  })
})
