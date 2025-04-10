"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CarDetails } from "@/components/CarDetails";
import { CarCard } from "@/components/CarCard";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchCars } from "@/lib/api";
import { Car } from "@/types/car";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlist";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Car as CarIcon, 
  Sliders, 
  SlidersHorizontal,
  DollarSign,
  Tag,
  FuelIcon,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [wishlist, setWishlist] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse");
  const [filtersVisible, setFiltersVisible] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState<number[]>([]);

  // Get unique values for filters
  const brands = Array.from(new Set(cars.map(car => car.brand))).sort();
  const fuelTypes = Array.from(new Set(cars.map(car => car.fuelType))).sort();
  const seatingCapacities = Array.from(new Set(cars.map(car => car.seatingCapacity))).sort((a, b) => a - b);
  const maxPrice = Math.max(...cars.map(car => car.price), 200000);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const carsData = await fetchCars();
        setCars(carsData);
        setFilteredCars(carsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        toast.error("Failed to load cars data");
        setLoading(false);
      }
    };

    const loadWishlist = () => {
      const wishlistData = getWishlist();
      setWishlist(wishlistData);
    };

    loadData();
    loadWishlist();
  }, []);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Apply filters
    let result = [...cars];

    // Search term filter
    if (searchTerm) {
      result = result.filter(car => 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(car => selectedBrands.includes(car.brand));
    }

    // Price range filter
    result = result.filter(car => car.price >= priceRange[0] && car.price <= priceRange[1]);

    // Fuel type filter
    if (selectedFuelTypes.length > 0) {
      result = result.filter(car => selectedFuelTypes.includes(car.fuelType));
    }

    // Seating capacity filter
    if (selectedSeatingCapacity.length > 0) {
      result = result.filter(car => selectedSeatingCapacity.includes(car.seatingCapacity));
    }

    setFilteredCars(result);
  }, [searchTerm, selectedBrands, priceRange, selectedFuelTypes, selectedSeatingCapacity, cars]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  const toggleBrandFilter = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleFuelTypeFilter = (fuelType: string) => {
    if (selectedFuelTypes.includes(fuelType)) {
      setSelectedFuelTypes(selectedFuelTypes.filter(f => f !== fuelType));
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, fuelType]);
    }
  };

  const toggleSeatingCapacityFilter = (capacity: number) => {
    if (selectedSeatingCapacity.includes(capacity)) {
      setSelectedSeatingCapacity(selectedSeatingCapacity.filter(s => s !== capacity));
    } else {
      setSelectedSeatingCapacity([...selectedSeatingCapacity, capacity]);
    }
  };

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
  };

  const handleWishlistToggle = (car: Car) => {
    if (wishlist.some(item => item.id === car.id)) {
      const updatedWishlist = removeFromWishlist(car.id);
      setWishlist(updatedWishlist);
      toast.success(`${car.brand} ${car.model} removed from wishlist`);
    } else {
      const updatedWishlist = addToWishlist(car);
      setWishlist(updatedWishlist);
      toast.success(`${car.brand} ${car.model} added to wishlist`);
    }
  };

  const closeDetails = () => {
    setSelectedCar(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSelectedFuelTypes([]);
    setSelectedSeatingCapacity([]);
    toast.info("Filters have been reset");
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and surrounding pages
      if (currentPage <= 3) {
        // Near start
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Middle
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    return (
      <div className="flex justify-center items-center space-x-1 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page as number)}
              className="h-9 w-9 font-medium"
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Get applied filters count for mobile badge
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (selectedBrands.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (selectedFuelTypes.length > 0) count++;
    if (selectedSeatingCapacity.length > 0) count++;
    return count;
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-2xl">
      <Card className="p-6 mb-8 bg-gradient-to-r from-background to-blue-50 dark:from-background dark:to-blue-950/20 border shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CarIcon className="h-8 w-8 text-primary" />
              Car Finder
            </h1>
            <p className="text-muted-foreground mt-1">Find your perfect vehicle from our extensive collection</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="mb-4">
            <TabsTrigger value="browse" className="text-lg px-6">
              <Search className="mr-2 h-4 w-4" />
              Browse Cars
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="text-lg px-6">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
              {wishlist.length > 0 && (
                <Badge variant="secondary" className="ml-2">{wishlist.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* Mobile filters toggle */}
          <Button 
            variant="outline" 
            className="lg:hidden flex items-center gap-1"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <Sliders className="h-4 w-4" />
            Filters
            {getAppliedFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">{getAppliedFiltersCount()}</Badge>
            )}
          </Button>
        </div>
        
        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters Panel */}
            <div className={`lg:col-span-3 ${filtersVisible ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center">
                      <Filter className="mr-2 h-5 w-5" />
                      Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8">
                      <X className="mr-1 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  <CardDescription>Narrow down your car search</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <ScrollArea className="h-[calc(100vh-300px)] pr-3">
                    <div className="space-y-6">
                      {/* Search */}
                      <div>
                        <Label htmlFor="search" className="flex items-center gap-1.5 mb-2">
                          <Search className="h-3.5 w-3.5" />
                          Search
                        </Label>
                        <Input
                          id="search"
                          placeholder="Search by brand or model"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      {/* Price Range */}
                      <div>
                        <Label className="flex items-center gap-1.5 mb-2">
                          <DollarSign className="h-3.5 w-3.5" />
                          Price Range
                        </Label>
                        <div className="mt-1">
                          <Slider
                            value={priceRange}
                            min={0}
                            max={maxPrice}
                            step={1000}
                            onValueChange={(value) => setPriceRange(value)}
                            className="mt-6 mb-4"
                          />
                          <div className="flex justify-between mt-2 text-sm">
                            <Badge variant="outline" className="font-normal">
                              ${priceRange[0].toLocaleString()}
                            </Badge>
                            <Badge variant="outline" className="font-normal">
                              ${priceRange[1].toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Brand Filter */}
                      <div>
                        <Label className="flex items-center gap-1.5 mb-2">
                          <Tag className="h-3.5 w-3.5" />
                          Brand
                          {selectedBrands.length > 0 && (
                            <Badge variant="secondary" className="ml-2 font-normal">
                              {selectedBrands.length}
                            </Badge>
                          )}
                        </Label>
                        <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border p-2">
                          {brands.map((brand) => (
                            <div key={brand} className="flex items-center">
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrandFilter(brand)}
                              />
                              <label htmlFor={`brand-${brand}`} className="ml-2 text-sm cursor-pointer">
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Fuel Type */}
                      <div>
                        <Label className="flex items-center gap-1.5 mb-2">
                          <FuelIcon className="h-3.5 w-3.5" />
                          Fuel Type
                          {selectedFuelTypes.length > 0 && (
                            <Badge variant="secondary" className="ml-2 font-normal">
                              {selectedFuelTypes.length}
                            </Badge>
                          )}
                        </Label>
                        <div className="space-y-2 rounded-md border p-2">
                          {fuelTypes.map((fuelType) => (
                            <div key={fuelType} className="flex items-center">
                              <Checkbox
                                id={`fuel-${fuelType}`}
                                checked={selectedFuelTypes.includes(fuelType)}
                                onCheckedChange={() => toggleFuelTypeFilter(fuelType)}
                              />
                              <label htmlFor={`fuel-${fuelType}`} className="ml-2 text-sm cursor-pointer">
                                {fuelType}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Seating Capacity */}
                      <div>
                        <Label className="flex items-center gap-1.5 mb-2">
                          <Users className="h-3.5 w-3.5" />
                          Seating Capacity
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {seatingCapacities.map((capacity) => (
                            <Badge
                              key={capacity}
                              variant={selectedSeatingCapacity.includes(capacity) ? "default" : "outline"}
                              className="cursor-pointer transition-colors hover:bg-primary/90"
                              onClick={() => toggleSeatingCapacityFilter(capacity)}
                            >
                              {capacity} seats
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            {/* Cars Grid */}
            <div className="lg:col-span-9">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  {/* Results summary */}
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        Available Cars
                        <Badge variant="secondary" className="ml-2 text-sm font-normal">
                          {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
                        </Badge>
                      </CardTitle>
                      {filteredCars.length > 0 && (
                        <CardDescription className="mt-1">
                          Page {currentPage} of {totalPages}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">Cars per page:</Label>
                      <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                      </select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 lg:hidden"
                        onClick={() => setFiltersVisible(!filtersVisible)}
                      >
                        <SlidersHorizontal className="h-4 w-4 mr-1" />
                        {filtersVisible ? 'Hide Filters' : 'Show Filters'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      <p className="text-muted-foreground">Loading vehicles...</p>
                    </div>
                  ) : filteredCars.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {currentItems.map((car) => (
                          <CarCard 
                            key={car.id} 
                            car={car} 
                            onClick={() => handleCarClick(car)}
                            onWishlistToggle={() => handleWishlistToggle(car)}
                            isInWishlist={wishlist.some(item => item.id === car.id)}
                          />
                        ))}
                      </div>
                      <Pagination />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-lg border border-dashed">
                      <CarIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                      <h3 className="text-xl font-medium">No matching cars found</h3>
                      <p className="text-muted-foreground mt-2 mb-4">Try adjusting your filters</p>
                      <Button variant="outline" onClick={resetFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wishlist">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Heart className="h-5 w-5" />
                My Wishlist
                <Badge variant="secondary" className="ml-1">
                  {wishlist.length} {wishlist.length === 1 ? 'car' : 'cars'}
                </Badge>
              </CardTitle>
              <CardDescription>Cars you've saved for later</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((car) => (
                    <CarCard 
                      key={car.id} 
                      car={car} 
                      onClick={() => handleCarClick(car)}
                      onWishlistToggle={() => handleWishlistToggle(car)}
                      isInWishlist={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-lg border border-dashed">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                  <h3 className="text-xl font-medium">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mt-2 mb-4">Save your favorite cars here</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("browse")}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Browse Cars
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedCar && (
        <CarDetails 
          car={selectedCar} 
          onClose={closeDetails}
          onWishlistToggle={() => handleWishlistToggle(selectedCar)}
          isInWishlist={wishlist.some(item => item.id === selectedCar.id)}
        />
      )}
    </div>
  );
}