import React, { useEffect, useState } from 'react'
import { db } from '@/firebaseConfig'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

const FichaTreino = () => {
  const [exerciciosVinculados, setExerciciosVinculados] = useState([])
  const [todosExercicios, setTodosExercicios] = useState([])
  const [exercicioSelecionado, setExercicioSelecionado] = useState('')
  const { addToast } = useToast()

  useEffect(() => {
    fetchExerciciosVinculados()
    fetchTodosExercicios()
  }, [])

  const fetchExerciciosVinculados = async () => {
    const q = query(collection(db, 'exercicios'), where('vinculado', '==', true))
    const querySnapshot = await getDocs(q)
    const fetchedExercicios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setExerciciosVinculados(fetchedExercicios)
  }

  const fetchTodosExercicios = async () => {
    const querySnapshot = await getDocs(collection(db, 'exercicios'))
    const fetchedExercicios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setTodosExercicios(fetchedExercicios)
  }

  const handleVincularExercicio = async () => {
    if (exercicioSelecionado) {
      const exercicioRef = doc(db, 'exercicios', exercicioSelecionado)
      try {
        await updateDoc(exercicioRef, { vinculado: true })

        addToast({
          title: 'Exercício vinculado',
          description: 'Clique para desfazer a ação.',
          action: {
            label: 'Desfazer',
            onClick: async () => {
              await updateDoc(exercicioRef, { vinculado: false })
              fetchExerciciosVinculados() // Atualiza a lista
            },
          },
        })

        setExercicioSelecionado('')
        fetchExerciciosVinculados() // Atualiza a lista automaticamente
      } catch (error) {
        console.error('Erro ao vincular exercício:', error)
        addToast({
          title: 'Erro',
          description: 'Não foi possível vincular o exercício.',
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 space-y-6 relative">
      {/* Ícone de voltar */}
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 p-2"
      >
        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
      </Button>

      <Card className="p-6 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4">Sua Ficha de Treino</h2>
        {exerciciosVinculados.length > 0 ? (
          <ul className="space-y-4">
            {exerciciosVinculados.map((exercicio) => (
              <li key={exercicio.id}>
                <Card className="p-4">
                  <h3 className="text-xl font-semibold">{exercicio.nome}</h3>
                  <p>Peso: {exercicio.peso} kg</p>
                  <p>Repetições: {exercicio.repeticoes}</p>
                  <p>Séries: {exercicio.series}</p>
                  {exercicio.observacao && (
                    <p className="text-gray-600">Observação: {exercicio.observacao}</p>
                  )}
                  {exercicio.videoUrl && (
                    <a href={exercicio.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      Ver Vídeo
                    </a>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">Nenhum exercício vinculado ainda.</p>
        )}

        {/* Select para vincular exercícios */}
        <Select onValueChange={(value) => setExercicioSelecionado(value)} value={exercicioSelecionado}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um exercício para vincular" />
          </SelectTrigger>
          <SelectContent>
            {todosExercicios.map((exercicio) => (
              <SelectItem key={exercicio.id} value={exercicio.id}>
                {exercicio.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-700"
          onClick={handleVincularExercicio}
        >
          Vincular Exercício à Ficha
        </Button>
      </Card>
    </div>
  )
}

export default FichaTreino
