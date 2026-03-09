import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import AddTaskForm from '../../components/AddTaskForm'

describe('AddTaskForm — composant interactif', () => {
  it('le bouton "Ajouter" est désactivé si le champ titre est vide', () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeDisabled()
  })

  it("le bouton s'active quand on saisit un titre", async () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(/titre/i), 'Ma nouvelle tâche')
    expect(screen.getByRole('button', { name: /ajouter/i })).not.toBeDisabled()
  })

  it('appelle onAdd avec les bonnes données à la soumission', async () => {
    const onAdd = vi.fn().mockResolvedValue()
    render(<AddTaskForm onAdd={onAdd} />)

    await userEvent.type(screen.getByLabelText(/titre/i), 'Faire du sport')
    await userEvent.selectOptions(screen.getByLabelText(/catégorie/i), 'perso')
    await userEvent.click(screen.getByRole('button', { name: /ajouter/i }))

    expect(onAdd).toHaveBeenCalledWith({ title: 'Faire du sport', category: 'perso' })
  })

  it('réinitialise le champ après soumission réussie', async () => {
    const onAdd = vi.fn().mockResolvedValue()
    render(<AddTaskForm onAdd={onAdd} />)

    const input = screen.getByLabelText(/titre/i)
    await userEvent.type(input, 'Tâche temporaire')
    await userEvent.click(screen.getByRole('button', { name: /ajouter/i }))

    expect(input).toHaveValue('')
  })

  it("affiche un message d'erreur si onAdd rejette", async () => {
    const onAdd = vi.fn().mockRejectedValue(new Error('API error'))
    render(<AddTaskForm onAdd={onAdd} />)

    await userEvent.type(screen.getByLabelText(/titre/i), 'Tâche')
    await userEvent.click(screen.getByRole('button', { name: /ajouter/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
