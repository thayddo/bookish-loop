import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { repo } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export async function loginUser(email: string, senha: string) {
  const user = await repo.getUserByEmail(email);
  if (!user) throw new Error("Usuário não encontrado");

  const match = await bcrypt.compare(senha, user.senha_hash);
  if (!match) throw new Error("Senha inválida");

  const token = jwt.sign(
    { id: user.id, email: user.email, tipo: user.tipo_usuario },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  return { token, user };
}

export function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Token não enviado" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}