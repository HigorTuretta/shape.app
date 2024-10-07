import React, { useState } from 'react'
import { db, auth } from '@/firebaseConfig'
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

const CadastrarExercicio = () => {
  const [nome, setNome] = useState('')
  const [peso, setPeso] = useState('')
  const [repeticoes, setRepeticoes] = useState('')
  const [series, setSeries] = useState('')
  const [observacao, setObservacao] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [vinculado, setVinculado] = useState(false)
  const { addToast } = useToast()

  const handleCadastrar = async (e) => {
    e.preventDefault()

    const user = auth.currentUser

    if (!user) {
      addToast({
        title: 'Erro',
        description: 'Usuário não autenticado.',
      })
      return
    }

    try {
      const docRef = await addDoc(collection(db, 'exercicios'), {
        nome,
        peso,
        repeticoes,
        series,
        observacao,
        videoUrl,
        vinculado: false,
        uid: user.uid, // Inclui o UID do usuário
      })

      addToast({
        title: 'Exercício cadastrado',
        description: 'Clique para desfazer o cadastro.',
        action: {
          label: 'Desfazer',
          onClick: async () => {
            await deleteDoc(doc(db, 'exercicios', docRef.id)) // Remove o documento
          },
        },
      })

      // Limpa os campos após o cadastro
      setNome('')
      setPeso('')
      setRepeticoes('')
      setSeries('')
      setObservacao('')
      setVideoUrl('')
      setVinculado(false)
    } catch (error) {
      console.error('Erro ao cadastrar exercício:', error)
      addToast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o exercício.',
      })
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
        <h2 className="text-3xl font-bold mb-4">Cadastrar Novo Exercício</h2>
        <form onSubmit={handleCadastrar} className="space-y-4">
          <Input
            type="text"
            placeholder="Nome do Exercício"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Peso (kg)"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Repetições"
            value={repeticoes}
            onChange={(e) => setRepeticoes(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Séries"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            required
          />
          <Textarea
            placeholder="Observação (opcional)"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
          <Input
            type="url"
            placeholder="Link do vídeo do YouTube (opcional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vinculado"
              checked={vinculado}
              onChange={(e) => setVinculado(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="vinculado" className="text-gray-700">
              Vincular à Ficha de Treino
            </label>
          </div>

          <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-700">
            Cadastrar Exercício
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default CadastrarExercicio
