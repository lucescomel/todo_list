import { AuthProvider, useAuth } from './context/AuthContext'
import LoginForm from './components/LoginForm'
import TaskList from './components/TaskList'
import './assets/css/App.css'

function AppContent() {
  const { user, logout } = useAuth()

  if (!user) return <LoginForm />

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">📋 Todo List</h1>
        <button onClick={logout} className="logout-button">
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
