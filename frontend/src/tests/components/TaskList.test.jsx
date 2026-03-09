import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TaskList from '../../components/TaskList'

// Mock du module API — on ne veut pas de vraies requêtes HTTP
vi.mock('../../services/api', () => ({
  tasksApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

import { tasksApi } from '../../services/api'

const MOCK_TASKS = [
  { id: 1, title: 'Tâche A', completed: false, category: 'travail' },
  { id: 2, title: 'Tâche B', completed: true, category: 'perso' },
]

beforeEach(() => {
  vi.clearAllMocks()
  tasksApi.getAll.mockResolvedValue({ data: MOCK_TASKS })
})

describe('TaskList — avec appels API mockés', () => {
  it('affiche un indicateur de chargement au montage', () => {
    tasksApi.getAll.mockReturnValue(new Promise(() => {})) // Ne résout jamais
    render(<TaskList />)
    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })

  it('affiche les tâches après chargement réussi', async () => {
    render(<TaskList />)
    expect(await screen.findByText('Tâche A')).toBeInTheDocument()
    expect(screen.getByText('Tâche B')).toBeInTheDocument()
  })

  it("affiche un message d'erreur si l'API échoue", async () => {
    tasksApi.getAll.mockRejectedValue(new Error('Network error'))
    render(<TaskList />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('ajoute une nouvelle tâche à la liste', async () => {
    const newTask = { id: 3, title: 'Nouvelle tâche', completed: false, category: 'autre' }
    tasksApi.create.mockResolvedValue({ data: newTask })

    render(<TaskList />)
    await screen.findByText('Tâche A')

    await userEvent.type(screen.getByLabelText(/titre/i), 'Nouvelle tâche')
    await userEvent.click(screen.getByRole('button', { name: /ajouter/i }))

    await waitFor(() => {
      expect(screen.getByText('Nouvelle tâche')).toBeInTheDocument()
    })
  })

  it('supprime une tâche de la liste', async () => {
    tasksApi.delete.mockResolvedValue({})
    render(<TaskList />)
    await screen.findByText('Tâche A')

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i })
    await userEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.queryByText('Tâche A')).not.toBeInTheDocument()
    })
  })
})
