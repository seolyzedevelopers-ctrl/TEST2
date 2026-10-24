import { CurrencyType, FoodDish } from '../types/food';

export const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
  USD: '$',
  INR: '₹',
  PKR: '₨',
  GBP: '£',
  EUR: '€'
};

export const formatPrice = (dish: FoodDish, currency: CurrencyType): string => {
  switch (currency) {
    case 'USD':
      return `$${dish.priceUSD.toFixed(2)}`;
    case 'INR':
      return `₹${Math.round(dish.priceINR).toLocaleString()}`;
    case 'PKR':
      return `₨${Math.round(dish.pricePKR).toLocaleString()}`;
    case 'GBP':
      return `£${(dish.priceUSD * 0.79).toFixed(2)}`;
    case 'EUR':
      return `€${(dish.priceUSD * 0.92).toFixed(2)}`;
    default:
      return `$${dish.priceUSD.toFixed(2)}`;
  }
};

export const formatCurrencyAmount = (amountUSD: number, currency: CurrencyType): string => {
  switch (currency) {
    case 'USD':
      return `$${amountUSD.toFixed(2)}`;
    case 'INR':
      return `₹${Math.round(amountUSD * 83).toLocaleString()}`;
    case 'PKR':
      return `₨${Math.round(amountUSD * 280).toLocaleString()}`;
    case 'GBP':
      return `£${(amountUSD * 0.79).toFixed(2)}`;
    case 'EUR':
      return `€${(amountUSD * 0.92).toFixed(2)}`;
    default:
      return `$${amountUSD.toFixed(2)}`;
  }
};

export const getSpiceLabel = (level: number): { label: string; color: string } => {
  switch (level) {
    case 0:
      return { label: 'Mild / Sweet', color: 'text-stone-500' };
    case 1:
      return { label: 'Gentle Warmth', color: 'text-amber-600' };
    case 2:
      return { label: 'Medium Desi', color: 'text-orange-600' };
    case 3:
      return { label: 'Spicy Masala', color: 'text-red-500' };
    case 4:
      return { label: 'Fiery Karachi / Lahori', color: 'text-red-600' };
    case 5:
      return { label: 'Desi Firestorm (Khaalis)', color: 'text-rose-700 font-semibold' };
    default:
      return { label: 'Medium', color: 'text-orange-600' };
  }
};
