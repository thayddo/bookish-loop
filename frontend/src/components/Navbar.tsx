import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartItems } = useCart();
  const totalExemplares = cartItems.reduce(
    (sum, item) => sum + item.quantity, 
    0
  );

  const { favorites } = useFavorites();
  const totalFavoritos = favorites.reduce(
    (sum, item) => sum + 1, 
    0
  );

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">
              ReBook
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por título, autor ou editora..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/catalog">
              <Button variant="ghost" className="font-medium">
                Catálogo
              </Button>
            </Link>
            <Link to="/admin/inventory">
              <Button variant="ghost" className="font-medium">
                Admin
              </Button>
            </Link>
            <Link to="/favorits">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalFavoritos}
                </span>
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                   {totalExemplares}
                </span>
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90">
                Entrar
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar livros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium">
                Catálogo
              </Button>
            </Link>
            <Link to="/admin/inventory" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium">
                Admin
              </Button>
            </Link>
            <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Heart className="h-5 w-5 mr-2" />
                Favoritos (0)
              </Button>
            </Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrinho (0)
              </Button>
            </Link>
            <div className="pt-3 border-t border-border">
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
