import { Car } from "@/types/car";
import { mockCars } from "@/data/mock-cars";

export async function fetchCars(): Promise<Car[]> {

  await new Promise(resolve => setTimeout(resolve, 800));
 
  return mockCars;
}