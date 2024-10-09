import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, query, collection, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import UserProfileCard from "@/components/CustomCards/UserProfileCard";
import WorkoutSummaryCard from "@/components/CustomCards/WorkoutSummaryCard";
import WeeklyWorkoutCalendar from "@/components/CustomCards/WeeklyWorkoutCalendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { differenceInDays, parseISO, format } from "date-fns";

const Home = () => {
  const [treinoAtivo, setTreinoAtivo] = useState(null);
  const [treinosDesativados, setTreinosDesativados] = useState([]); // Para armazenar os treinos desativados
  const [progresso, setProgresso] = useState(0);
  const [diasCompletados, setDiasCompletados] = useState(0);
  const [totalDias, setTotalDias] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTreinos = async () => {
      const user = auth.currentUser;
      if (user) {
        const qAtivos = query(collection(db, "treinos"), where("uid", "==", user.uid), where("ativo", "==", true));
        const qDesativados = query(collection(db, "treinos"), where("uid", "==", user.uid), where("ativo", "==", false));

        const [treinoAtivoSnapshot, treinosDesativadosSnapshot] = await Promise.all([getDocs(qAtivos), getDocs(qDesativados)]);

        if (!treinoAtivoSnapshot.empty) {
          const treino = treinoAtivoSnapshot.docs[0].data();
          setTreinoAtivo({ ...treino, id: treinoAtivoSnapshot.docs[0].id });
          const totalDiasTreino = calculateTotalDays(treino.interval.start, treino.interval.end);
          setTotalDias(totalDiasTreino);
        }

        const desativados = treinosDesativadosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTreinosDesativados(desativados);
      }
    };
    fetchTreinos();
  }, []);

  const calculateTotalDays = (start, end) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    return differenceInDays(endDate, startDate) + 1;
  };

  const handleToggleTreinoAtivo = async (checked) => {
    if (treinoAtivo) {
      try {
        await updateDoc(doc(db, "treinos", treinoAtivo.id), { ativo: checked });
        setTreinoAtivo((prev) => ({ ...prev, ativo: checked }));
        toast({
          title: checked ? "Treino ativado" : "Treino desativado",
          description: `O treino foi ${checked ? "ativado" : "desativado"} com sucesso!`,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o treino.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDiaCompletado = (dia) => {
    setDiasCompletados((prev) => prev + 1);
    setProgresso(((diasCompletados + 1) / totalDias) * 100);
  };

  const isToday = (day) => {
    const today = format(new Date(), "EEEEEE").toLowerCase();
    return today.startsWith(day.toLowerCase());
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 space-y-4">
      {/* Perfil e Treino Ativo */}
      <UserProfileCard name="Taylor" progressMessage="Continue evoluindo!" />

      {treinoAtivo ? (
        <WorkoutSummaryCard
          nomeTreino={treinoAtivo.nome}
          progress={progresso}
          completedDays={diasCompletados}
          totalDays={totalDias}
          isActive={treinoAtivo.ativo}
          onToggleActive={handleToggleTreinoAtivo}
        />
      ) : (
        <div className="text-center text-gray-500">Nenhum treino ativo</div>
      )}

      {/* Calendário */}
      <WeeklyWorkoutCalendar onDiaCompletado={handleDiaCompletado} highlightToday={isToday} />

      {/* Treinos Desativados */}
      {treinosDesativados.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Treinos Desativados</h3>
          {treinosDesativados.map((treino) => (
            <WorkoutSummaryCard
              key={treino.id}
              nomeTreino={treino.nome}
              isActive={false}
              onToggleActive={() => handleToggleTreinoAtivo(true)}
            />
          ))}
        </div>
      )}

      {/* Botão Flutuante */}
      <Button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-xl"
        onClick={() => navigate("/adicionar-treino")}
      >
        + Adicionar Treino
      </Button>
    </div>
  );
};

export default Home;
