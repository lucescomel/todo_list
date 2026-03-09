import { useState } from 'react'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
      aria-label="Ajouter une tâche"
    >
      <input
        type="text"
        placeholder="Nouvelle tâche…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Titre de la tâche"
        style={{ flex: 1, minWidth: 200 }}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Catégorie"
        style={{ width: 130 }}
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || !title.trim()}
        style={{ background: '#6366f1', color: '#fff' }}
      >
        {loading ? '…' : 'Ajouter'}
      </button>
      {error && (
        <p role="alert" style={{ width: '100%', color: '#dc2626', fontSize: '0.85rem' }}>
          {error}
        </p>
      )}
    </form>
  )
}
