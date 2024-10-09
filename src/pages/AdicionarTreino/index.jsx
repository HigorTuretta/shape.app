import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, getDocs, where, query } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker"; // Importando o DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Importando os estilos
import { addDays } from "date-fns";
import { ptBR } from "date-fns/locale"; // Importando locale para pt-BR
import { Switch } from "@/components/ui/switch"; // Switch estilizado

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const CadastrarTreino = () => {
  const { register, handleSubmit } = useForm();
  const [selectedDay, setSelectedDay] = useState(null); // Dia da semana selecionado
  const [exercises, setExercises] = useState([]); // Exercícios vindos do Firebase
  const [selectedExercises, setSelectedExercises] = useState({});
  const [restDays, setRestDays] = useState([]); // Dias de descanso
  const [startDate, setStartDate] = useState(new Date()); // Data de início do intervalo
  const [endDate, setEndDate] = useState(addDays(new Date(), 7)); // Data de fim do intervalo
  const [ativo, setAtivo] = useState(true); // Estado do treino (ativo ou não)
  const { toast } = useToast();
  const navigate = useNavigate();

  // Buscar exercícios do banco de dados Firebase
  useEffect(() => {
    const fetchExercicios = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "exercicios"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setExercises(data);
      }
    };
    fetchExercicios();
  }, []);

  // Adicionar ou remover um exercício no dia selecionado
  const toggleExercise = (exerciseId) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay]?.includes(exerciseId)
        ? prev[selectedDay].filter((id) => id !== exerciseId)
        : [...(prev[selectedDay] || []), exerciseId],
    }));
  };

  // Marcar ou desmarcar um dia como descanso
  const toggleRestDay = (day) => {
    if (restDays.includes(day)) {
      setRestDays(restDays.filter((d) => d !== day));
      setSelectedExercises((prev) => {
        const updated = { ...prev };
        delete updated[day];
        return updated;
      });
    } else {
      setRestDays([...restDays, day]);
      setSelectedExercises((prev) => {
        const updated = { ...prev };
        delete updated[day]; // Remove os exercícios se o dia for marcado como descanso
        return updated;
      });
    }
  };

  const onSubmit = async (data) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDoc(collection(db, "treinos"), {
        ...data,
        exercises: selectedExercises,
        restDays,
        interval: { start: startDate, end: endDate },
        ativo, // Incluindo o campo ativo no cadastro
        uid: user.uid,
      });

      toast({
        title: "Treino Cadastrado",
        description: "O treino foi adicionado com sucesso!",
      });

      navigate("/home");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o treino.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="space-y-6"
      >
        {/* Header com ícone de voltar */}
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
          </Button>
          <h2 className="text-3xl font-bold ml-2">Cadastrar Ficha de Treino</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome do Treino */}
          <div>
            <Input
              type="text"
              placeholder="Nome do Treino"
              {...register("nome", { required: true })}
              className="w-full p-3 rounded border"
            />
          </div>

          {/* Intervalo de Dias */}
          <div className="mt-4">
            <label className="text-lg font-medium mb-2 block">Intervalo de Dias:</label>
            <div className="flex items-center gap-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                locale={ptBR}
                className="border p-2 rounded"
              />
              <span>até</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                locale={ptBR}
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Seleção de Dias da Semana */}
          <div className="mt-4">
            <label className="text-lg font-medium mb-2 block">Dias da Semana:</label>
            <div className="flex gap-3 flex-wrap">
              {diasSemana.map((day, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className={`p-3 border rounded-lg w-16 ${selectedDay === index ? "bg-blue-200" : "bg-gray-100"} ${restDays.includes(index) ? "bg-red-200" : ""}`}
                  onClick={() => setSelectedDay(index)}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Marcar como descanso */}
          <div className="mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => toggleRestDay(selectedDay)}
              className={`w-full ${restDays.includes(selectedDay) ? "bg-red-200" : "bg-green-100"}`}
            >
              {restDays.includes(selectedDay) ? "Remover Descanso" : "Marcar como Descanso"}
            </Button>
          </div>

          {/* Exercícios para o dia selecionado */}
          {selectedDay !== null && !restDays.includes(selectedDay) && (
            <div className="mt-6">
              <label className="text-lg font-medium mb-2 block">
                Exercícios para {diasSemana[selectedDay]}:
              </label>
              {exercises.length === 0 ? (
                <div className="text-gray-500">Nenhum exercício disponível.</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {exercises.map((exercise) => (
                    <motion.div
                      key={exercise.id}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 border rounded-lg cursor-pointer ${selectedExercises[selectedDay]?.includes(exercise.id) ? "bg-green-100" : "bg-gray-100"}`}
                      onClick={() => toggleExercise(exercise.id)}
                    >
                      <span className="font-medium">{exercise.nome}</span>
                      <p className="text-sm text-gray-500">{exercise.tipo}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Toggle Ativo com Switch */}
          <div className="mt-6">
            <label className="text-lg font-medium mb-2 block">Ativar Treino?</label>
            <div className="flex items-center">
              <Switch checked={ativo} onCheckedChange={(checked) => setAtivo(checked)} />
              <span className="ml-2 text-gray-700">{ativo ? "Ativo" : "Desativado"}</span>
            </div>
          </div>

          {/* Botão para cadastrar treino */}
          <Button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg">
            Cadastrar Treino
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CadastrarTreino;
