import { toast } from "@/hooks/use-toast";
import { createContext, useContext, useState, ReactNode } from "react";

interface FavoriteBook {
  id: string | number;
  title: string;
  author: string;
  imageUrl: string;
  condition: string;
  price: string | number;
}

interface FavoritesContextType {
  favorites: FavoriteBook[];
  toggleFavorite: (book: FavoriteBook) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);

  const toggleFavorite = (book: FavoriteBook) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === book.id);

      if (exists) {
        return prev.filter((item) => item.id !== book.id); // desfavorita
      }

      toast({
        title: "Livro adicionado 🛒",
        description: `${book.title} foi adicionado ao carrinho.`,
      });
      return [...prev, book]; // adiciona favorito
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites precisa estar dentro de FavoritesProvider");
  }
  return ctx;
};
