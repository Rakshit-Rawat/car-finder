import { Heart, Fuel, Gauge, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "@/types/car";
import Image from "next/image";

interface CarCardProps {
  car: Car;
  onClick: () => void;
  onWishlistToggle: () => void;
  isInWishlist: boolean;
}

export function CarCard({ car, onClick, onWishlistToggle, isInWishlist }: CarCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:scale-[1.01] group">
      <div className="relative">
        <img
          src={car.imageUrl || "/api/placeholder/400/240"}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover cursor-pointer group-hover:brightness-105 transition-all"
          onClick={onClick}
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors "
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-primary text-primary" : ""}`} />
        </Button>
        
        
      </div>
      
      <CardContent className="p-4 cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg leading-tight">{car.brand} {car.model}</h3>
          <p className="font-bold text-lg text-primary">${car.price.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mb-4">
          <div className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{car.seatingCapacity} seats</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {car.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs font-normal">
              {feature}
            </Badge>
          ))}
          {car.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{car.features.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full group-hover:bg-primary/90 transition-colors" 
          onClick={onClick}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}