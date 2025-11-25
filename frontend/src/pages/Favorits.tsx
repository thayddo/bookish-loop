import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BookMarked, ShoppingCart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  // Função para adicionar ao carrinho (usada dentro do map)
  const handleAddToCart = (book: any) => {
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: parseFloat(book.price), // converte caso venha string
      condition: book.condition,
      imageUrl: book.imageUrl,
      image: book.imageUrl,
    });
  };

  // Caso não haja favoritos
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <BookMarked className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-serif font-bold mb-4">Nenhum favorito ainda</h1>
            <p className="text-muted-foreground mb-8">
              Comece explorando nosso catálogo e marque seus títulos preferidos!
            </p>
            <Link to="/catalog">
              <Button size="lg">Explorar Catálogo</Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Meus Favoritos</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />

                  {/* Remover favorito */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => toggleFavorite(book)}
                  >
                    <Heart className="h-5 w-5 fill-accent text-accent" />
                  </Button>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>

                  {book.condition && (
                    <p className="text-sm font-medium mt-2">
                      Condição: {book.condition}
                    </p>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-serif font-bold text-primary">
                      R$ {parseFloat(book.price.toString()).toFixed(2)}
                    </span>

                    {/* Adicionar ao carrinho */}
                    <Button
                      size="icon"
                      className="bg-accent hover:bg-accent/90"
                      aria-label="Adicionar ao carrinho"
                      onClick={() => handleAddToCart(book)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;