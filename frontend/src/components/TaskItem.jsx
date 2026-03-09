const CATEGORY_LABELS = {
  travail: 'Travail',
  perso: 'Perso',
  courses: 'Courses',
  autre: 'Autre',
}

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: '#fff',
        borderRadius: 8,
        marginBottom: '0.5rem',
        boxShadow: '0 1px 4px #0001',
        opacity: task.completed ? 0.6 : 1,
      }}
      data-testid="task-item"
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Marquer "${task.title}" comme ${task.completed ? 'non terminée' : 'terminée'}`}
        style={{ width: 18, height: 18, flexShrink: 0 }}
      />
      <span
        style={{
          flex: 1,
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </span>
      <span
        className={`badge badge-${task.category}`}
        style={{
          fontSize: '0.75rem',
          padding: '2px 8px',
          borderRadius: 99,
          background: '#e0e7ff',
          color: '#4338ca',
          fontWeight: 600,
        }}
      >
        {CATEGORY_LABELS[task.category] ?? task.category}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Supprimer "${task.title}"`}
        style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', fontSize: '0.8rem' }}
      >
        ✕
      </button>
    </li>
  )
}
