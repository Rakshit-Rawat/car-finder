import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/car";
import { Heart, Fuel, Gauge, Users, Settings, Calendar, Palette } from "lucide-react";
import Image from "next/image";

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
  onWishlistToggle: () => void;
  isInWishlist: boolean;
}

export function CarDetails({ car, onClose, onWishlistToggle, isInWishlist }: CarDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); 
  };

  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[100vh] ">
        <DialogHeader className="relative mb-4">
          <div className="absolute right-0 top-0 flex">
            <Button
              variant={isInWishlist ? "default" : "outline"}
              size="sm"
              className="mr-4"
              onClick={(e) => {
                e.preventDefault();
                onWishlistToggle();
              }}
            >
              <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? "fill-white" : ""}`} />
              {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          <div className="pr-32"> {/* Add padding to avoid title overlapping with buttons */}
            <DialogTitle className="text-2xl font-bold">{car.brand} {car.model} </DialogTitle>
            <DialogDescription className="text-xl font-bold text-primary mt-1">
              ${car.price.toLocaleString()}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Image
              src={car.imageUrl || "/api/placeholder/500/300"}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-60 object-cover rounded-md"
            />
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                Description
              </h3>
              <p className="text-sm text-muted-foreground">{car.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="font-normal">{feature}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                Specifications
              </h3>
              
              <div className="grid gap-3">
                <div className="grid grid-cols-2 p-3 rounded-md bg-muted/40 border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Year</span>
                  </div>
                  <div className="font-medium">{car.year}</div>
                </div>
                
                <div className="grid grid-cols-2 p-3 rounded-md bg-muted/40 border">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Color</span>
                  </div>
                  <div className="font-medium">{car.color}</div>
                </div>
                
                <div className="grid grid-cols-2 p-3 rounded-md bg-muted/40 border">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Fuel Type</span>
                  </div>
                  <div className="font-medium">{car.fuelType}</div>
                </div>
                
                <div className="grid grid-cols-2 p-3 rounded-md bg-muted/40 border">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Transmission</span>
                  </div>
                  <div className="font-medium">{car.transmission}</div>
                </div>
                
                <div className="grid grid-cols-2 p-3 rounded-md bg-muted/40 border">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Mileage</span>
                  </div>
                  <div className="font-medium">{car.mileage.toLocaleString()} km</div>
                </div>
                
                <div className="grid grid-cols-2 p-3 rounded-md bg-muted/40 border">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Seating</span>
                  </div>
                  <div className="font-medium">{car.seatingCapacity} seats</div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button className="w-full">Contact Seller</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}