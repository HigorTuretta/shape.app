import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebaseConfig";
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ToastAction } from "@/components/ui/toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FcAlarmClock, FcProcess } from "react-icons/fc";
import {
  GiShoulderArmor,
  GiBackPain,
  GiBiceps,
  GiChestArmor,
  GiFist,
  GiLeg,
  GiMuscularTorso,
  GiStrong
} from "react-icons/gi";

const getTipoIcon = (tipo) => {
  switch (tipo) {
    case "Ombros":
      return <GiShoulderArmor className="text-xl" />;
    case "Costas":
      return <GiBackPain className="text-xl" />;
    case "Bíceps":
      return <GiBiceps className="text-xl" />;
    case "Peito":
      return <GiChestArmor className="text-xl" />;
    case "Tríceps":
      return <GiFist className="text-xl" />;
    case "Pernas":
      return <GiLeg className="text-xl" />;
    case "Abdômen":
      return <GiMuscularTorso className="text-xl" />;
    case "Glúteos":
      return <GiStrong className="text-xl" />;
    default:
      return <GiMuscularTorso className="text-xl" />;
  }
};

const CadastrarExercicio = () => {
  const [nome, setNome] = useState("");
  const [peso, setPeso] = useState("");
  const [repeticoes, setRepeticoes] = useState("");
  const [series, setSeries] = useState("");
  const [observacao, setObservacao] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tipo, setTipo] = useState("");
  const [exercicios, setExercicios] = useState([]);
  const { toast } = useToast();
  
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal de edição
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Modal de confirmação para exclusão
  const [selectedExercicio, setSelectedExercicio] = useState(null); // Exercício selecionado para edição ou exclusão

  useEffect(() => {
    const fetchExercicios = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast({
            title: "Erro",
            description: "Usuário não autenticado.",
            variant: "destructive",
          });
          return;
        }

        console.log("Usuário autenticado:", user.uid);

        // Query para buscar os exercícios do usuário
        const q = query(collection(db, "exercicios"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Exercícios carregados:", data);
        setExercicios(data);
      } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
        toast({
          title: "Erro ao carregar os exercícios",
          description: "Não foi possível carregar os exercícios.",
          variant: "destructive",
        });
      }
    };

    fetchExercicios();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    const existingExercise = exercicios.find((ex) => ex.nome.toLowerCase() === nome.toLowerCase());
    if (existingExercise) {
      toast({
        title: "Erro",
        description: "Exercício já cadastrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "exercicios"), {
        nome, peso, repeticoes, series, tipo, observacao, videoUrl, vinculado: false, uid: user.uid
      });

      toast({
        title: "Exercício cadastrado",
        description: "Clique para desfazer o cadastro.",
        action: (
          <ToastAction altText="Desfazer" onClick={async () => {
            await deleteDoc(doc(db, "exercicios", docRef.id));
            toast({ title: "Exercício removido", description: "O cadastro foi desfeito." });
          }}>
            Desfazer
          </ToastAction>
        ),
      });

      // Adicionar o novo exercício na lista
      setExercicios((prevExercicios) => [
        ...prevExercicios,
        { id: docRef.id, nome, peso, repeticoes, series, tipo, observacao, videoUrl },
      ]);

      setNome(""); setPeso(""); setRepeticoes(""); setSeries(""); setObservacao(""); setVideoUrl(""); setTipo("");
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o exercício.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Button variant="ghost" onClick={() => window.history.back()} className="absolute top-4 left-4 p-2">
        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
      </Button>

      {/* Formulário para cadastro de exercícios */}
      <Card className="p-6 max-w-md w-full mx-auto">
        <h2 className="text-3xl font-bold mb-4">Cadastrar Novo Exercício</h2>
        <form onSubmit={handleCadastrar} className="space-y-4">
          <Input type="text" placeholder="Nome do Exercício" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} required />
          <Input type="number" placeholder="Repetições" value={repeticoes} onChange={(e) => setRepeticoes(e.target.value)} required />
          <Input type="number" placeholder="Séries" value={series} onChange={(e) => setSeries(e.target.value)} required />
          <Select onValueChange={setTipo}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Selecione a região muscular" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Ombros">Ombros</SelectItem>
              <SelectItem value="Costas">Costas</SelectItem>
              <SelectItem value="Bíceps">Bíceps</SelectItem>
              <SelectItem value="Peito">Peito</SelectItem>
              <SelectItem value="Tríceps">Tríceps</SelectItem>
              <SelectItem value="Pernas">Pernas</SelectItem>
              <SelectItem value="Abdômen">Abdômen</SelectItem>
              <SelectItem value="Glúteos">Glúteos</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Observação (opcional)" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
          <Input type="url" placeholder="Link do vídeo do YouTube (opcional)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
          <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-700">Cadastrar Exercício</Button>
        </form>
      </Card>

      {/* Lista de exercícios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exercicios.map((exercicio) => (
          <Card key={exercicio.id} className="p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold">{exercicio.nome}</h3>
              <div className="flex items-center justify-between mt-2">
                <span><FcProcess /> {exercicio.repeticoes} reps</span>
                <span><FcAlarmClock /> {exercicio.series} séries</span>
                <span>{getTipoIcon(exercicio.tipo)}</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" onClick={() => handleEditar(exercicio)}>Editar</Button>
              <Button variant="destructive" onClick={() => handleExcluir(exercicio)}>Excluir</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CadastrarExercicio;
