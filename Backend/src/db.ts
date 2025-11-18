import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

export const repo = {
  // ======================================
  // 👤 USUÁRIOS
  // ======================================
  async getUserByEmail(email: string) {
    const result = await sql`SELECT * FROM usuarios WHERE email = ${email}`;
    return result[0] || null;
  },

  async createUser({ nome, email, senha_hash, telefone, tipo_usuario }: any) {
    const result = await sql`
      INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo_usuario)
      VALUES (${nome}, ${email}, ${senha_hash}, ${telefone}, ${tipo_usuario})
      RETURNING *;
    `;
    return result[0];
  },

  // ======================================
  // 📚 LIVROS
  // ======================================
  async listBooks() {
    const result = await sql`SELECT * FROM livros ORDER BY id DESC`;
    return result;
  },

  async getBook(id: number) {
    const result = await sql`SELECT * FROM livros WHERE id = ${id}`;
    return result[0] || null;
  },

  async createBook({ titulo, autor, preco, estoque, descricao, categoria_id }: any) {
    const result = await sql`
      INSERT INTO livros (titulo, autor, preco, estoque, descricao, categoria_id)
      VALUES (${titulo}, ${autor}, ${preco}, ${estoque}, ${descricao}, ${categoria_id})
      RETURNING *;
    `;
    return result[0];
  },

  async updateBook(id: number, { titulo, autor, preco, estoque, descricao, categoria_id }: any) {
    const result = await sql`
      UPDATE livros
      SET titulo = ${titulo},
          autor = ${autor},
          preco = ${preco},
          estoque = ${estoque},
          descricao = ${descricao},
          categoria_id = ${categoria_id}
      WHERE id = ${id}
      RETURNING *;
    `;
    return result[0] || null;
  },

  async deleteBook(id: number) {
    const result = await sql`DELETE FROM livros WHERE id = ${id} RETURNING id;`;
    return result.length > 0;
  },

  // ======================================
  // 🧾 CLIENTES
  // ======================================
  async listCustomers(limit = 100, offset = 0) {
    const result = await sql`
      SELECT * FROM clientes
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
    return result;
  },

  async createCustomer({ nome, email, telefone, endereco_id }: any) {
    const result = await sql`
      INSERT INTO clientes (nome, email, telefone, endereco_id)
      VALUES (${nome}, ${email}, ${telefone}, ${endereco_id})
      RETURNING *;
    `;
    return result[0];
  },

  // ======================================
  // 📦 PEDIDOS
  // ======================================
  async createPedido(usuario_id: number, endereco_id: number, valor_total: number) {
    const result = await sql`
      INSERT INTO pedidos (usuario_id, endereco_id, valor_total)
      VALUES (${usuario_id}, ${endereco_id}, ${valor_total})
      RETURNING *;
    `;
    return result[0];
  },

  async listPedidosByUser(usuario_id: number) {
    const result = await sql`
      SELECT * FROM pedidos
      WHERE usuario_id = ${usuario_id}
      ORDER BY criado_em DESC;
    `;
    return result;
  },
};