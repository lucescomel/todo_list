import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskItem from '../../components/TaskItem'

const mockTask = {
  id: 1,
  title: 'Acheter du pain',
  completed: false,
  category: 'courses',
}

const mockTaskCompleted = { ...mockTask, completed: true }

describe('TaskItem — composant de présentation', () => {
  it('affiche le titre de la tâche', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Acheter du pain')).toBeInTheDocument()
  })

  it('affiche la catégorie lisible', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Courses')).toBeInTheDocument()
  })

  it('affiche une tâche non terminée sans style barré', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const title = screen.getByText('Acheter du pain')
    expect(title).not.toHaveStyle('text-decoration: line-through')
  })

  it('affiche une tâche terminée avec style "terminée"', () => {
    render(<TaskItem task={mockTaskCompleted} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const title = screen.getByText('Acheter du pain')
    expect(title).toHaveStyle('text-decoration: line-through')
  })

  it('appelle onToggle au clic sur la checkbox', async () => {
    const onToggle = vi.fn()
    render(<TaskItem task={mockTask} onToggle={onToggle} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(mockTask)
  })

  it('appelle onDelete au clic sur le bouton supprimer', async () => {
    const onDelete = vi.fn()
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /supprimer/i }))
    expect(onDelete).toHaveBeenCalledWith(mockTask.id)
  })
})
