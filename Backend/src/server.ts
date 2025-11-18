import 'dotenv/config';
import "dotenv/config";
import express from "express";
import  cors from "cors";
import bcrypt from "bcrypt";

import { repo } from "./db.js";
import { loginUser, authMiddleware } from "./auth.js";
import { createBookSchema, updateBookSchema, createCustomerSchema } from "./validators.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok", now: new Date().toISOString() });
});

// ===============================
// 🔐 LOGIN / AUTENTICAÇÃO
// ===============================
app.post("/login", async (req: any, res: any) => {
  const { email, senha } = req.body;
  try {
    const data = await loginUser(email, senha);
    res.json(data);
  } catch (err:any) {
    res.status(401).json({ error: err.message });
  }
});

// ===============================
// 👤 REGISTRO DE USUÁRIOS
// ===============================
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo_usuario } = req.body;

    const senha_hash = await bcrypt.hash(senha, 10);

    const user = await repo.createUser({
      nome,
      email,
      senha_hash,
      telefone,
      tipo_usuario,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

// ===============================
// 📚 LIVROS
// ===============================
app.get("/books", async (req, res) => {
  const list = await repo.listBooks();
  res.json(list);
});

app.get("/books/:id", async (req: any, res: any) => {
  const book = await repo.getBook(req.params.id);
  if (!book) return res.status(404).json({ error: "Livro não encontrado" });
  res.json(book);
});

app.post("/books", async (req, res) => {
  const parsed = createBookSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const created = await repo.createBook(parsed.data);
  res.status(201).json(created);
});

app.put("/books/:id", async (req:any, res) => {
  const parsed = updateBookSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const updated = await repo.updateBook(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: "Livro não encontrado" });
  res.json(updated);
});

app.delete("/books/:id", async (req:any, res) => {
  const ok = await repo.deleteBook(req.params.id);
  if (!ok) return res.status(404).json({ error: "Livro não encontrado" });
  res.status(204).send();
});

// ===============================
// 🧾 CLIENTES (APENAS ADMIN)
// ===============================
app.get("/customers", async (req, res) => {
  const list = await repo.listCustomers(100, 0);
  res.json(list);
});

app.post("/customers", async (req, res) => {
  const parsed = createCustomerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const created = await repo.createCustomer(parsed.data);
  res.status(201).json(created);
});

// ===============================
// 🛒 PEDIDOS (CARRINHO) — PROTEGIDO
// ===============================
app.get("/pedidos", authMiddleware, async (req:any, res) => {
  const pedidos = await repo.listPedidosByUser(req.user.id);
  res.json(pedidos);
});

app.post("/pedidos", authMiddleware, async (req:any, res) => {
  const { endereco_id, valor_total } = req.body;
  try {
    const pedido = await repo.createPedido(req.user.id, endereco_id, valor_total);
    res.status(201).json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

// ===============================
// 📊 RELATÓRIO RESUMO (ADMIN)
// ===============================
app.get("/reports/summary", async (_req, res) => {
  const books = await repo.listBooks();
  const customers = await repo.listCustomers(1000, 0);
  const totalInventory = books.reduce((acc, b) => acc + (b.estoque ?? 0), 0);
  res.json({
    booksCount: books.length,
    customersCount: customers.length,
    totalInventory,
  });
});

// ===============================
// 🚀 INICIALIZAÇÃO
// ===============================
app.listen(PORT, () => {
  console.log(`📚 Bookish Loop backend rodando em http://localhost:${PORT}`);
});

export default app;