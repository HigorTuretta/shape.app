import React, { useState, useEffect } from "react";
import { getDay, format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Obter os dias da semana
const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const WeeklyWorkoutCalendar = () => {
  const [completedDays, setCompletedDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(getDay(new Date()));

  // Atualizar o dia atual dinamicamente
  useEffect(() => {
    const today = getDay(new Date());
    setCurrentDay(today);
  }, []);

  const handleDayClick = (dayIndex) => {
    // Marcar ou desmarcar o dia como concluído
    if (completedDays.includes(dayIndex)) {
      setCompletedDays(completedDays.filter((day) => day !== dayIndex));
    } else {
      setCompletedDays([...completedDays, dayIndex]);
    }
  };

  const isDayCompleted = (dayIndex) => completedDays.includes(dayIndex);

  // Gerar os dias da semana com base no dia atual
  const generateWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(today, i - currentDay)); // Ajuste para exibir a semana correta
    }
    return days;
  };

  const weekDays = generateWeekDays();

  return (
    <div className="w-full max-w- flex flex-col mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Indicador de dias completados */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold text-gray-700">{`${completedDays.length} de 7 dias no foco!`}</div>
      </div>

      {/* Calendário semanal */}
      <div className="flex overflow-x-auto space-x-4">
        {weekDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(index)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-32 bg-white shadow-md rounded-xl cursor-pointer transition duration-300 ${
              isDayCompleted(index)
                ? "bg-green-500 text-black hover:bg-green-600" // Texto preto quando concluído
                : index === currentDay
                ? "bg-red-500 text-white hover:bg-red-600" // Dia atual em vermelho com texto branco
                : "bg-gray-100 text-black hover:bg-gray-300" // Dias normais
            }`}
          >
            <div
              className={`${
                isDayCompleted(index) ? "bg-green-700 text-white" : "bg-red-500 text-white"
              } w-full text-center font-bold p-1 rounded-t-md`}
            >
              {format(day, "MMM", { locale: ptBR }).toUpperCase()} {/* Nome abreviado do mês */}
            </div>
            <div className="text-3xl font-bold">{format(day, "dd")}</div> {/* Dia do mês */}
            <div className="text-sm">{daysOfWeek[getDay(day)]}</div> {/* Nome do dia */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyWorkoutCalendar;
