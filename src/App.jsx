import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import CallModal from './components/CallModal'

const App = () => {
  const { authUser } = useContext(AuthContext)
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <CallModal />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0B1D30',
            border: '1px solid rgba(212,167,44,0.35)',
            color: '#FFF7E6',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.85rem',
          },
          success: {
            iconTheme: { primary: '#20C997', secondary: '#06111F' },
          },
          error: {
            iconTheme: { primary: '#D64545', secondary: '#06111F' },
          },
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App