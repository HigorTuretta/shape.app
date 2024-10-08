import React from "react";
import { Switch } from "@/components/ui/switch"; // Adiciona o Switch para ativar/desativar o treino

const WorkoutSummaryCard = ({ nomeTreino, progress, completedDays, totalDays, isActive, onToggleActive }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{nomeTreino}</h3>
        <Switch checked={isActive} onCheckedChange={onToggleActive} />
      </div>
      <p className="text-sm text-gray-500">{completedDays} de {totalDays} dias concluídos</p>
      <div className="w-full h-2 bg-gray-300 rounded-full">
        <div className="h-2 bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default WorkoutSummaryCard;
