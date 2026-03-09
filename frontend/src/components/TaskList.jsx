import { useEffect, useState, useCallback } from 'react'
import { tasksApi } from '../services/api'
import TaskItem from './TaskItem'
import AddTaskForm from './AddTaskForm'

const FILTER_OPTIONS = [
  { value: '', label: 'Toutes' },
  { value: 'travail', label: 'Travail' },
  { value: 'perso', label: 'Perso' },
  { value: 'courses', label: 'Courses' },
  { value: 'autre', label: 'Autre' },
]

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await tasksApi.getAll(filter)
      setTasks(data)
    } catch {
      setError('Impossible de charger les tâches.')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleAdd = async (taskData) => {
    const { data } = await tasksApi.create(taskData)
    setTasks((prev) => [data, ...prev])
  }

  const handleToggle = async (task) => {
    const { data } = await tasksApi.update(task.id, { completed: !task.completed })
    setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)))
  }

  const handleDelete = async (id) => {
    await tasksApi.delete(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div>
      <AddTaskForm onAdd={handleAdd} />

      {/* Filtres par catégorie */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            aria-pressed={filter === opt.value}
            style={{
              background: filter === opt.value ? '#6366f1' : '#e5e7eb',
              color: filter === opt.value ? '#fff' : '#374151',
              padding: '4px 14px',
              fontSize: '0.85rem',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && <p aria-live="polite">Chargement…</p>}
      {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && !error && (
        tasks.length === 0
          ? <p style={{ color: '#6b7280' }}>Aucune tâche pour l'instant.</p>
          : (
            <ul style={{ listStyle: 'none', padding: 0 }} aria-label="Liste des tâches">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )
      )}
    </div>
  )
}
