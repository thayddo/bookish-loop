// src/services/catalogService.js
import axios from "axios";

const API_URL = "http://localhost:4000/books"; 

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
