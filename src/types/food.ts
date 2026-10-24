export type CuisineType = 'all' | 'indian' | 'pakistani' | 'shared';

export type CategoryType = 
  | 'all'
  | 'curries'
  | 'rice'
  | 'bbq_kebabs'
  | 'dals_veggies'
  | 'street_food'
  | 'breads'
  | 'desserts'
  | 'beverages';

export type DietaryTag = 
  | 'Halal'
  | 'Pure Veg'
  | 'Non-Veg'
  | 'Vegan'
  | 'Gluten-Free'
  | 'High Protein'
  | 'Low Carb';

export type CurrencyType = 'USD' | 'INR' | 'PKR' | 'GBP' | 'EUR';

export interface FoodDish {
  id: string;
  name: string;
  nativeName: string;
  cuisine: 'indian' | 'pakistani' | 'shared';
  region: string;
  category: CategoryType;
  servingUnit: string;
  servingWeightGrams: number;
  calories: number; // kcal
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  saturatedFat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
  glycemicIndex: 'Low' | 'Medium' | 'High';
  spiceLevel: number; // 0 to 5
  prepTimeMin: number;
  dietary: DietaryTag[];
  priceUSD: number;
  priceINR: number;
  pricePKR: number;
  description: string;
  keyIngredients: string[];
  healthySwapTip: string;
  proteinRatio: number; // protein kcal % of total calories
}

export interface MealItem {
  dish: FoodDish;
  servings: number; // 0.5, 1, 1.5, 2, etc.
}

export interface NutritionTarget {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  fiber: number;
  description: string;
}

export interface FilterState {
  searchQuery: string;
  cuisine: CuisineType;
  category: CategoryType;
  dietary: DietaryTag[];
  maxCalories: number;
  minProtein: number;
  maxSpice: number;
  sortBy: 'calories-asc' | 'calories-desc' | 'protein-desc' | 'price-asc' | 'spice-desc' | 'name-asc';
}
