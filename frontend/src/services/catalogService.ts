// src/services/catalogService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/books";

export const catalogService = {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      throw error;
    }
  },
};
