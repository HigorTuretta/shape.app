import React from 'react'
import { auth } from '@/firebaseConfig'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const user = auth.currentUser
  const navigate = useNavigate()

  const handleFichaTreino = () => {
    navigate('/ficha-treino')
  }

  const handleAdicionarExercicio = () => {
    navigate('/cadastrar-exercicio')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(https://via.placeholder.com/1920x1080)' }}
    >
      <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-lg w-full">
        <Card className="p-6 bg-white bg-opacity-80">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-900">
            Bem-vindo, {user?.displayName || 'Usuário'}!
          </h2>
          <p className="text-center text-gray-700 mb-6">Email: {user?.email}</p>

          <div className="flex flex-col space-y-4">
            {/* Botão para ver a ficha de treino */}
            <Button
              className="w-full text-lg bg-blue-500 text-white hover:bg-blue-700"
              onClick={handleFichaTreino}
            >
              Ver Ficha de Treino
            </Button>

            {/* Botão para adicionar novo exercício */}
            <Button
              className="w-full text-lg bg-green-500 text-white hover:bg-green-700"
              onClick={handleAdicionarExercicio}
            >
              Adicionar Exercício
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Home