import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import TaskList from './components/TaskList'
import './assets/css/App.css'
import * as Sentry from '@sentry/react'

function AppContent() {
  const { user, login, logout } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (!user) {
    if (showRegister) {
      return (
        <RegisterForm
          onSuccess={async (username, password) => {
            await login(username, password)
          }}
          onBack={() => setShowRegister(false)}
        />
      )
    }
    return <LoginForm onRegister={() => setShowRegister(true)} />
  }

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">📋 Todo List</h1>
          <button onClick={() => Sentry.captureException(new Error("Test Frontend"))}>
              Test Sentry
          </button>
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
