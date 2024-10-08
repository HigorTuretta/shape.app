import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, query, collection, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import UserProfileCard from "@/components/CustomCards/UserProfileCard";
import WorkoutSummaryCard from "@/components/CustomCards/WorkoutSummaryCard";
import WeeklyWorkoutCalendar from "@/components/CustomCards/WeeklyWorkoutCalendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [treinoAtivo, setTreinoAtivo] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [diasCompletados, setDiasCompletados] = useState(0);
  const [totalDias, setTotalDias] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para buscar o treino ativo
  useEffect(() => {
    const fetchTreinoAtivo = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "treinos"), where("uid", "==", user.uid), where("ativo", "==", true));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const treino = querySnapshot.docs[0].data(); // Pegamos o primeiro treino ativo encontrado
          setTreinoAtivo({ ...treino, id: querySnapshot.docs[0].id });
          setTotalDias(calculateTotalDays(treino.intervaloDias)); // Calcula o total de dias do treino
        }
      }
    };
    fetchTreinoAtivo();
  }, []);

  // Função para calcular o total de dias do intervalo de treino
  const calculateTotalDays = (intervaloDias) => {
    const start = new Date(intervaloDias[0].startDate);
    const end = new Date(intervaloDias[0].endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Função para ativar/desativar a ficha de treino
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

  // Função para calcular o progresso de dias completados
  const handleDiaCompletado = (dia) => {
    setDiasCompletados((prev) => prev + 1);
    setProgresso(((diasCompletados + 1) / totalDias) * 100); // Atualiza o progresso
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <UserProfileCard name="Taylor" progressMessage="Hoje é mais um passo para se tornar a melhor versão de você mesmo!" />

      {treinoAtivo ? (
        <WorkoutSummaryCard
          nomeTreino={treinoAtivo.nomeTreino}
          progress={progresso}
          completedDays={diasCompletados}
          totalDays={totalDias}
          isActive={treinoAtivo.ativo}
          onToggleActive={handleToggleTreinoAtivo}
        />
      ) : (
        <div className="text-center text-gray-500">Nenhum treino ativo</div>
      )}

      <WeeklyWorkoutCalendar onDiaCompletado={handleDiaCompletado} />

      <Button className="w-full bg-black text-white" onClick={() => navigate("/adicionar-treino")}>
        + Adicionar Treino
      </Button>
    </div>
  );
};

export default Home;
