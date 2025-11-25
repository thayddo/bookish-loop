// ==========================================
// userService.ts
// Serviço para comunicação entre o frontend e o backend
// ==========================================

import axios from "axios";

// URL base do backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/user"; // ajuste para sua API

// ==========================================
// Tipos de dados
// ==========================================
export interface UserRegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

// ==========================================
// Token helpers
// ==========================================
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
};

// Carregar token salvo ao iniciar app
const storedToken = localStorage.getItem("authToken");
if (storedToken) {
  setAuthToken(storedToken);
}

// ==========================================
// Serviços
// ==========================================

// Registrar novo usuário
export const registerUser = async (data: UserRegisterDTO): Promise<string> => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data.message;
};

// Login e retorno dos dados + token
export const loginUser = async (
  data: UserLoginDTO
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, data);

  // Salvar token internamente
  setAuthToken(response.data.token);

  return response.data;
};

// Buscar usuário logado
export const getAuthUser = async (): Promise<AuthUser> => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

// Logout (apenas apaga token)
export const logoutUser = async (): Promise<void> => {
  await axios.post(`${API_URL}/logout`);

  // Remover token
  setAuthToken(null);
};