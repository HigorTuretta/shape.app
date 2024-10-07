// src/pages/Register/index.jsx
import React, { useState } from 'react'
import { auth } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Cria o usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Atualiza o nome do usuário no perfil
      await updateProfile(userCredential.user, { displayName: name })

      // Redireciona para a página principal após o cadastro
      navigate('/')
    } catch (error) {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.')
      console.error('Register error', error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Cadastro</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          {error && <p className="text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Cadastrar</Button>
        </form>
      </Card>
    </div>
  )
}

export default Register
