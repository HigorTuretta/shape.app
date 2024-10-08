import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import CadastrarExercicio from '@/pages/CadastrarExercicio'
import { auth } from '@/firebaseConfig'
import { useEffect, useState } from 'react'
import AdicionarTreino from '@/pages/AdicionarTreino'

const AppRoutes = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/adicionar-treino" element={user ? <AdicionarTreino /> : <Navigate to="/login" />} />
        <Route path="/cadastrar-exercicio" element={user ? <CadastrarExercicio /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
