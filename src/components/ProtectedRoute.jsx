import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "@/firebaseConfig"; // Certifique-se de que o Firebase está configurado corretamente

const ProtectedRoute = () => {
  const user = auth.currentUser;

  // Se não houver um usuário autenticado, redireciona para a tela de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário estiver autenticado, renderiza a rota protegida
  return <Outlet />;
};

export default ProtectedRoute;
