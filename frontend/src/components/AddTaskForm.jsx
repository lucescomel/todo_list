import { useState } from 'react'
import '../assets/css/AddTaskForm.css'

const CATEGORIES = [
  { value: 'travail', label: 'Travail' },
  { value: 'perso', label: 'Perso' },
  { value: 'courses', label: 'Courses' },
  { value: 'autre', label: 'Autre' },
]

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('autre')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim()) return
    setError(null)
    setLoading(true)
    try {
      await onAdd({ title: title.trim(), category })
      setTitle('')
      setCategory('autre')
    } catch {
      setError('Erreur lors de la création de la tâche.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="add-task-form"
      aria-label="Ajouter une tâche"
    >
      <input
        type="text"
        placeholder="Nouvelle tâche…"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-label="Titre de la tâche"
        className="task-input"
        required
      />
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        aria-label="Catégorie"
        className="category-select"
      >
        {CATEGORIES.map((categoryOption) => (
          <option key={categoryOption.value} value={categoryOption.value}>{categoryOption.label}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="add-button"
      >
        {loading ? '…' : 'Ajouter'}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </form>
  )
}
