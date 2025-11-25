// ===============================
// user.routes.ts
// Rotas para autenticação e gestão de usuários
// ===============================

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Simulação de banco (troque por Prisma/TypeORM/PostgreSQL depois)
const users: any[] = [];

// Secret key do JWT (ideal usar variável de ambiente)
const JWT_SECRET = "MEGA_SECRET_KEY_2025";

const router = Router();

// ======================================
// Interface do usuário
// ======================================
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hash
  createdAt: Date;
}

// ======================================
// Middleware para validar token
// ======================================
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

// ======================================
// Rota: Registrar usuário
// POST /api/user/register
// ======================================
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Verificar se email já existe
  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: "Email já cadastrado" });
  }

  // Criptografar senha
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: String(Date.now()),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  users.push(newUser);

  return res.status(201).json({ message: "Usuário registrado com sucesso" });
});

// ======================================
// Rota: Login
// POST /api/user/login
// ======================================
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Credenciais inválidas" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "2h",
  });

  return res.json({
    message: "Login realizado com sucesso",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// ======================================
// Rota: buscar dados do usuário logado
// GET /api/user/me
// ======================================
router.get("/me", authMiddleware, (req: Request, res: Response) => {
  const loggedUserId = (req as any).userId;

  const user = users.find((u) => u.id === loggedUserId);

  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  });
});

// ======================================
// Rota: Logout (frontend apenas apaga o token)
// POST /api/user/logout
// ======================================
router.post("/logout", (req: Request, res: Response) => {
  return res.json({ message: "Logout realizado (token removido no frontend)" });
});

export default router;