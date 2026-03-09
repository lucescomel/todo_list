import { AuthProvider, useAuth } from './context/AuthContext'
import LoginForm from './components/LoginForm'
import TaskList from './components/TaskList'

function AppContent() {
  const { user, logout } = useAuth()

  if (!user) return <LoginForm />

  return (
    <div>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>📋 Todo List</h1>
        <button
          onClick={logout}
          style={{ background: '#f3f4f6', color: '#374151', fontSize: '0.85rem' }}
        >
          Déconnexion
        </button>
      </header>
      <TaskList />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
