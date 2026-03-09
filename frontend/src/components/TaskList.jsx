import { useEffect, useState, useCallback } from 'react'
import { tasksApi } from '../services/api'
import TaskItem from './TaskItem'
import AddTaskForm from './AddTaskForm'
import '../assets/css/TaskList.css'

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
    setTasks((previousTasks) => [data, ...previousTasks])
  }

  const handleToggle = async (task) => {
    const { data } = await tasksApi.update(task.id, { completed: !task.completed })
    setTasks((previousTasks) => previousTasks.map((item) => (item.id === task.id ? data : item)))
  }

  const handleDelete = async (taskId) => {
    await tasksApi.delete(taskId)
    setTasks((previousTasks) => previousTasks.filter((item) => item.id !== taskId))
  }

  return (
    <div>
      <AddTaskForm onAdd={handleAdd} />

      {/* Filtres par catégorie */}
      <div className="filters-container">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
            className={`filter-button ${filter === option.value ? 'active' : 'inactive'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading && <p aria-live="polite">Chargement…</p>}
      {error && <p role="alert" className="error-text">{error}</p>}

      {!loading && !error && (
        tasks.length === 0
          ? <p className="empty-message">Aucune tâche pour l'instant.</p>
          : (
            <ul className="task-list" aria-label="Liste des tâches">
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
