import { useState , useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

interface Book {
  id: String;
  titulo: string;
  autor: string;
  descricao: string;
  valor: string;
  estoque: number;
  imagem_url: string;
  isbn?: string;
  data_cadastro?: string;
  //editora?: string; // caso exista no banco
}

const Catalog = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:4000/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold mb-2">Catálogo de Livros</h1>
          <p className="text-muted-foreground">
            Explore nossa coleção de livros usados em excelente estado
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-slide-up">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <div className="flex flex-wrap gap-4 items-center">
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="title">Título A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Condição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="excellent">Ótimo Estado</SelectItem>
                <SelectItem value="good">Bom Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm text-muted-foreground">
            {books.length} livros encontrados
          </span>
        </div>

        {/* Filters Sidebar - Mobile */}
        {showFilters && (
          <div className="sm:hidden mb-6 p-4 bg-card rounded-lg border border-border animate-slide-up">
            <h3 className="font-semibold mb-4">Faixa de Preço</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R$ {priceRange[0]}</span>
                <span>R$ {priceRange[1]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {books.map((book) => (
            <BookCard
              id={book.id.toString()}
              key={book.id.toString()}
              title={book.titulo}
              author={book.autor}
              //publisher={book.editora ?? "Editora não informada"}
              price={book.valor}
              imageUrl={book.imagem_url}
              condition="Ótimo Estado"
              isFavorite={false}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
