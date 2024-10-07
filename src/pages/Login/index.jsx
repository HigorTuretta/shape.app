// src/pages/Login/index.jsx
import React, { useState } from 'react'
import { auth, googleProvider } from '@/firebaseConfig'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Google login error', error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        <Button onClick={handleGoogleLogin} className="w-full mt-4">
          Login com Google
        </Button>
        <div className="mt-4 text-center">
          <span>Não tem uma conta? </span>
          <Link to="/register" className="text-blue-600">Cadastre-se</Link>
        </div>
      </Card>
    </div>
  )
}

export default Login
