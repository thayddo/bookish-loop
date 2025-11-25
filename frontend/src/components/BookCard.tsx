import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext"; 
import { useFavorites } from "@/context/FavoritesContext";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: string;
  originalPrice?: string;
  condition: string;
  imageUrl: string;
  isFavorite?: boolean;
}

const BookCard = ({
  id,
  title,
  author,
  price,
  originalPrice,
  condition,
  imageUrl,
  isFavorite = false,
}: BookCardProps) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart({
      id,                 // <-- DINÂMICO
      title,
      author,
      price: parseFloat(price),
      condition,
      imageUrl,
      image: imageUrl
    });
  };
  const { favorites, toggleFavorite } = useFavorites();
  const isFavoriteBook = favorites.some((f) => f.id === id);

  const handleToggleFavorite = () => {
    toggleFavorite({
      id,
      title,
      author,
      imageUrl,
      condition,
      price: parseFloat(price),
    });
};
  return (
    <Card className="group overflow-hidden hover:shadow-hover transition-all duration-300 border-border bg-card">
      <div className="relative overflow-hidden aspect-[3/4] bg-secondary">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 opacity-0
            group-hover:opacity-100
            transition-opacity bg-card/90 
            backdrop-blur-sm hover:bg-accent 
            hover:text-accent-foreground"
           onClick={() => handleToggleFavorite()} 
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${
              isFavoriteBook ? "fill-accent text-accent" : "text-muted-foreground"
            }`}/>
        </Button>
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {condition}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">{author}</p>
        {/**<p className="text-xs text-muted-foreground">{publisher}</p>**/}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              R$ {price}
            </span>
          </div>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              R$ {originalPrice}
            </span>
          )}
        </div>
        <Button 
          size="icon"
          className="bg-accent hover:bg-accent/90"
          aria-label="Adicionar ao carrinho"
          onClick={() => handleAddToCart()}>
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
  };
export default BookCard;
