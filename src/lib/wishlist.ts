import { Car } from "@/types/car";

const WISHLIST_KEY = 'car-finder-wishlist';

export function getWishlist(): Car[] {
  if (typeof window === 'undefined') return [];
  
  const wishlistJSON = localStorage.getItem(WISHLIST_KEY);
  if (!wishlistJSON) return [];
  
  try {
    return JSON.parse(wishlistJSON);
  } catch (error) {
    console.error('Failed to parse wishlist from localStorage:', error);
    return [];
  }
}

export function addToWishlist(car: Car): Car[] {
  if (typeof window === 'undefined') return [];
  
  const currentWishlist = getWishlist();
  if (currentWishlist.some(item => item.id === car.id)) {
    return currentWishlist;
  }
  
  const newWishlist = [...currentWishlist, car];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
  return newWishlist;
}

export function removeFromWishlist(carId: string): Car[] {
  if (typeof window === 'undefined') return [];
  
  const currentWishlist = getWishlist();
  const newWishlist = currentWishlist.filter(car => car.id !== carId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
  return newWishlist;
}