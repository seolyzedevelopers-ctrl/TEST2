import React, { useState } from 'react';
import { FOOD_DISHES, CUISINE_METRICS } from '../data/dishes';
import { CurrencyType, CategoryType } from '../types/food';
import { formatCurrencyAmount } from '../utils/formatters';
import { Flame, Beef, Salad, DollarSign, Award } from 'lucide-react';

interface CuisineAverageDashboardProps {
  currency: CurrencyType;
  onSelectDishToInspect: (dishId: string) => void;
}

export const CuisineAverageDashboard: React.FC<CuisineAverageDashboardProps> = ({
  currency,
  onSelectDishToInspect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

  // Calculate dynamic averages based on selected category filter
  const getCuisineAverages = (cuisineKey: 'indian' | 'pakistani' | 'shared') => {
    const dishes = FOOD_DISHES.filter(
      d => d.cuisine === cuisineKey && (selectedCategory === 'all' || d.category === selectedCategory)
    );
    if (dishes.length === 0) {
      return {
        count: 0,
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        avgSpice: 0,
        avgPriceUSD: 0,
        avgFiber: 0,
        vegRatio: 0
      };
    }

    const count = dishes.length;
    const totalCalories = dishes.reduce((acc, d) => acc + d.calories, 0);
    const totalProtein = dishes.reduce((acc, d) => acc + d.protein, 0);
    const totalCarbs = dishes.reduce((acc, d) => acc + d.carbs, 0);
    const totalFat = dishes.reduce((acc, d) => acc + d.fat, 0);
    const totalSpice = dishes.reduce((acc, d) => acc + d.spiceLevel, 0);
    const totalPriceUSD = dishes.reduce((acc, d) => acc + d.priceUSD, 0);
    const totalFiber = dishes.reduce((acc, d) => acc + d.fiber, 0);
    const vegCount = dishes.filter(d => d.dietary.includes('Pure Veg') || d.dietary.includes('Vegan')).length;

    return {
      count,
      avgCalories: Math.round(totalCalories / count),
      avgProtein: Math.round((totalProtein / count) * 10) / 10,
      avgCarbs: Math.round((totalCarbs / count) * 10) / 10,
      avgFat: Math.round((totalFat / count) * 10) / 10,
      avgSpice: Math.round((totalSpice / count) * 10) / 10,
      avgPriceUSD: Math.round((totalPriceUSD / count) * 10) / 10,
      avgFiber: Math.round((totalFiber / count) * 10) / 10,
      vegRatio: Math.round((vegCount / count) * 100)
    };
  };

  const indianStats = getCuisineAverages('indian');
  const pakistaniStats = getCuisineAverages('pakistani');
  const sharedStats = getCuisineAverages('shared');

  const maxCal = Math.max(indianStats.avgCalories, pakistaniStats.avgCalories, sharedStats.avgCalories, 600);
  const maxProt = Math.max(indianStats.avgProtein, pakistaniStats.avgProtein, sharedStats.avgProtein, 45);
  const maxFat = Math.max(indianStats.avgFat, pakistaniStats.avgFat, sharedStats.avgFat, 40);
  const maxSpice = 5;

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-sm border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Indian vs Pakistani Food Average Bar</span>
              <span className="text-amber-400 text-sm font-normal">· Macro & Flavor Benchmarks</span>
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Side-by-side comparative averages across classic recipes. Pakistani cuisine showcases rich, high-protein bone-in meats and high-flame wok cooking, while Indian cuisine excels in diverse plant proteins, dairy curds, and slow-simmered whole gravies.
            </p>
          </div>

          {/* Category Filter Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-800/80 rounded-xl border border-stone-700/60">
            {[
              { id: 'all', label: 'All Dishes' },
              { id: 'curries', label: 'Curries' },
              { id: 'rice', label: 'Biryanis & Rice' },
              { id: 'bbq_kebabs', label: 'BBQ & Kebabs' },
              { id: 'breads', label: 'Breads' },
              { id: 'street_food', label: 'Street Food' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryType | 'all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3 Column Average Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pakistani Average Card */}
        <div className="bg-white rounded-xl border border-emerald-900/15 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h3 className="font-bold text-stone-900 text-base">Pakistani Food Average</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Based on {pakistaniStats.count} iconic recipes</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              High Protein & Spice
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Calories</span>
                <span className="font-bold text-stone-900 font-mono">{pakistaniStats.avgCalories} kcal</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(pakistaniStats.avgCalories / maxCal) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Protein</span>
                <span className="font-bold text-emerald-700 font-mono">{pakistaniStats.avgProtein}g / serving</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(pakistaniStats.avgProtein / maxProt) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Fat</span>
                <span className="font-bold text-stone-900 font-mono">{pakistaniStats.avgFat}g</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(pakistaniStats.avgFat / maxFat) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Spice Heat</span>
                <span className="font-bold text-red-600 font-mono">{pakistaniStats.avgSpice} / 5.0</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(pakistaniStats.avgSpice / maxSpice) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Avg Restaurant Price</span>
              <span className="font-bold text-stone-900 font-mono">
                {formatCurrencyAmount(pakistaniStats.avgPriceUSD, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Vegetarian Ratio</span>
              <span className="font-medium text-stone-700">{pakistaniStats.vegRatio}% plant-based</span>
            </div>
          </div>
        </div>

        {/* Indian Average Card */}
        <div className="bg-white rounded-xl border border-orange-900/15 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <h3 className="font-bold text-stone-900 text-base">Indian Food Average</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Based on {indianStats.count} iconic recipes</p>
            </div>
            <span className="text-[11px] font-semibold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              High Fiber & Dairy Rich
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Calories</span>
                <span className="font-bold text-stone-900 font-mono">{indianStats.avgCalories} kcal</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(indianStats.avgCalories / maxCal) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Protein</span>
                <span className="font-bold text-orange-700 font-mono">{indianStats.avgProtein}g / serving</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(indianStats.avgProtein / maxProt) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Fat</span>
                <span className="font-bold text-stone-900 font-mono">{indianStats.avgFat}g</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(indianStats.avgFat / maxFat) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Spice Heat</span>
                <span className="font-bold text-amber-700 font-mono">{indianStats.avgSpice} / 5.0</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(indianStats.avgSpice / maxSpice) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Avg Restaurant Price</span>
              <span className="font-bold text-stone-900 font-mono">
                {formatCurrencyAmount(indianStats.avgPriceUSD, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Vegetarian Ratio</span>
              <span className="font-medium text-stone-700">{indianStats.vegRatio}% plant-based</span>
            </div>
          </div>
        </div>

        {/* Shared Subcontinent Average Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-600" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <h3 className="font-bold text-stone-900 text-base">Shared Subcontinent Staples</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Based on {sharedStats.count} shared heritage foods</p>
            </div>
            <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Balanced Comfort
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Calories</span>
                <span className="font-bold text-stone-900 font-mono">{sharedStats.avgCalories} kcal</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(sharedStats.avgCalories / maxCal) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Protein</span>
                <span className="font-bold text-amber-800 font-mono">{sharedStats.avgProtein}g / serving</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(sharedStats.avgProtein / maxProt) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Fat</span>
                <span className="font-bold text-stone-900 font-mono">{sharedStats.avgFat}g</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(sharedStats.avgFat / maxFat) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Average Spice Heat</span>
                <span className="font-bold text-amber-700 font-mono">{sharedStats.avgSpice} / 5.0</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(sharedStats.avgSpice / maxSpice) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Avg Restaurant Price</span>
              <span className="font-bold text-stone-900 font-mono">
                {formatCurrencyAmount(sharedStats.avgPriceUSD, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Vegetarian Ratio</span>
              <span className="font-medium text-stone-700">{sharedStats.vegRatio}% plant-based</span>
            </div>
          </div>
        </div>
      </div>

      {/* Head-to-Head Key Insights Bar */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
        <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Core Dietary Differences & Takeaways</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600 leading-relaxed">
          <div className="bg-white p-3.5 rounded-lg border border-stone-200/80 shadow-2xs">
            <span className="font-semibold text-stone-900 block mb-1">🍗 Protein Dominance in Pakistani Cooking</span>
            Pakistani entrees average <strong className="text-emerald-700 font-semibold">32.4g protein</strong> versus 21.6g in Indian dishes, driven by tender beef shanks (Nihari), Peshawar char-grilled mince (Chapli Kabab), and whole chicken karahi.
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-stone-200/80 shadow-2xs">
            <span className="font-semibold text-stone-900 block mb-1">🌱 Fiber & Plant Diversity in Indian Food</span>
            Indian entrees supply significantly higher dietary fiber (<strong className="text-orange-700 font-semibold">5.8g avg</strong>) thanks to toor/urad/chana dals, leafy sarson/palak greens, and fermented rice/lentil batters.
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-stone-200/80 shadow-2xs">
            <span className="font-semibold text-stone-900 block mb-1">🌶️ The Heat & Cooking Fat Profiles</span>
            Pakistani cooking leans on raw animal fats/ghee searing with fresh ginger juliennes and pungent green chilies, while Indian curries balance heat with curd, dairy cream, cashews, and coconut.
          </div>
        </div>
      </div>
    </div>
  );
};
