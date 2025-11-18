import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** Interface dos itens do carrinho */
export interface CartItem {
  id: number;
  titulo: string;
  autor: string;
  valor: number;
  quantidade: number;
  imagem_url: string;
}

/** ===============================
 *  📚 LIVROS
 *  =============================== */
export const getBooks = async () => {
  const res = await axios.get(`${API_URL}/books`);
  return res.data;
};

/** ===============================
 *  🛒 CARRINHO / PEDIDOS
 *  =============================== */

/** Cria um novo pedido (checkout) */
export const createOrder = async (
  token: string,
  endereco_id: number,
  valor_total: number
) => {
  const res = await axios.post(
    `${API_URL}/pedidos`,
    { endereco_id, valor_total },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** Lista pedidos do usuário logado */
export const listOrders = async (token: string) => {
  const res = await axios.get(`${API_URL}/pedidos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/** ===============================
 *  🔐 AUTENTICAÇÃO
 *  =============================== */

/** Login do usuário — retorna token JWT */
export const login = async (email: string, senha: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, senha });
  return res.data;
};

/** Registro de novo usuário */
export const register = async (userData: {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  tipo_usuario?: string;
}) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

/** ===============================
 *  💰 PAGAMENTO SIMULADO
 *  =============================== */
export const confirmPayment = async (pedidoId: number) => {
  // Futuro: integração com a rota de pagamento do backend
  return { status: "pago", pedidoId, data: new Date().toISOString() };
};
/** Simula falha no pagamento */
export const failPayment = async (pedidoId: number) => {
  return { status: "falha", pedidoId, data: new Date().toISOString() };
};