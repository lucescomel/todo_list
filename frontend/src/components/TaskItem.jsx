import '../assets/css/TaskItem.css'

const CATEGORY_LABELS = {
  travail: 'Travail',
  perso: 'Perso',
  courses: 'Courses',
  autre: 'Autre',
}

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li
      className={`task-item ${task.completed ? 'completed' : ''}`}
      data-testid="task-item"
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Marquer "${task.title}" comme ${task.completed ? 'non terminée' : 'terminée'}`}
        className="task-checkbox"
      />
      <span className={`task-title ${task.completed ? 'completed' : ''}`}>
        {task.title}
      </span>
      <span className="task-badge">
        {CATEGORY_LABELS[task.category] ?? task.category}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Supprimer "${task.title}"`}
        className="task-delete-button"
      >
        ✕
      </button>
    </li>
  )
}
