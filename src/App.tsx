import React, { useState, useEffect, useMemo } from 'react';
import { FoodDish, FilterState, MealItem, CurrencyType } from './types/food';
import { FOOD_DISHES } from './data/dishes';
import { PRESET_MEALS } from './data/presets';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { DishCard } from './components/DishCard';
import { CuisineAverageDashboard } from './components/CuisineAverageDashboard';
import { HeadToHeadCompare } from './components/HeadToHeadCompare';
import { MealPlateDrawer } from './components/MealPlateDrawer';
import { DishDetailModal } from './components/DishDetailModal';
import { Utensils, Sparkles, Flame, Check, ArrowRight } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  cuisine: 'all',
  category: 'all',
  dietary: [],
  maxCalories: 1000,
  minProtein: 0,
  maxSpice: 5,
  sortBy: 'calories-asc'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'explorer' | 'cuisineAverages' | 'compare'>('explorer');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [mealItems, setMealItems] = useState<MealItem[]>(() => {
    try {
      const saved = localStorage.getItem('desimacro_meal');
      if (saved) {
        const parsed = JSON.parse(saved);
        // re-hydrate with current dish references
        return parsed.map((item: { dishId: string; servings: number }) => {
          const found = FOOD_DISHES.find(d => d.id === item.dishId);
          return found ? { dish: found, servings: item.servings } : null;
        }).filter(Boolean);
      }
    } catch {
      // ignore
    }
    // Default initial plate with an iconic pairing
    const nihari = FOOD_DISHES.find(d => d.id === 'nihari-beef');
    const roti = FOOD_DISHES.find(d => d.id === 'tandoori-roti');
    return [
      nihari ? { dish: nihari, servings: 1 } : null,
      roti ? { dish: roti, servings: 2 } : null
    ].filter(Boolean) as MealItem[];
  });

  const [isMealDrawerOpen, setIsMealDrawerOpen] = useState(false);
  const [detailModalDish, setDetailModalDish] = useState<FoodDish | null>(null);
  const [comparePair, setComparePair] = useState<{ id1: string; id2: string }>({
    id1: 'butter-chicken',
    id2: 'chicken-karahi-pakistani'
  });

  // Save meal items to localStorage
  useEffect(() => {
    try {
      const simplified = mealItems.map(i => ({ dishId: i.dish.id, servings: i.servings }));
      localStorage.setItem('desimacro_meal', JSON.stringify(simplified));
    } catch {
      // ignore
    }
  }, [mealItems]);

  // Filtered & Sorted Dishes
  const filteredDishes = useMemo(() => {
    return FOOD_DISHES.filter(dish => {
      // Cuisine filter
      if (filters.cuisine !== 'all' && dish.cuisine !== filters.cuisine) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && dish.category !== filters.category) {
        return false;
      }

      // Dietary filters (all must match)
      if (filters.dietary.length > 0) {
        const hasAllDietary = filters.dietary.every(tag => {
          if (tag === 'High Protein') return dish.protein >= 20;
          if (tag === 'Low Carb') return dish.carbs <= 25;
          return dish.dietary.includes(tag);
        });
        if (!hasAllDietary) return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesNative = dish.nativeName.toLowerCase().includes(query);
        const matchesRegion = dish.region.toLowerCase().includes(query);
        const matchesIngredient = dish.keyIngredients.some(ing => ing.toLowerCase().includes(query));
        if (!matchesName && !matchesNative && !matchesRegion && !matchesIngredient) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'calories-asc':
          return a.calories - b.calories;
        case 'calories-desc':
          return b.calories - a.calories;
        case 'protein-desc':
          return b.protein - a.protein;
        case 'price-asc':
          return a.priceUSD - b.priceUSD;
        case 'spice-desc':
          return b.spiceLevel - a.spiceLevel;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filters]);

  // Meal plate mutations
  const handleAddToMeal = (dish: FoodDish) => {
    setMealItems(prev => {
      const existing = prev.find(i => i.dish.id === dish.id);
      if (existing) {
        return prev.map(i => i.dish.id === dish.id ? { ...i, servings: i.servings + 0.5 } : i);
      }
      return [...prev, { dish, servings: 1 }];
    });
  };

  const handleUpdateServings = (dishId: string, delta: number) => {
    setMealItems(prev => {
      return prev.map(i => {
        if (i.dish.id === dishId) {
          const nextServings = Math.max(0.5, i.servings + delta);
          return { ...i, servings: nextServings };
        }
        return i;
      });
    });
  };

  const handleRemoveFromMeal = (dishId: string) => {
    setMealItems(prev => prev.filter(i => i.dish.id !== dishId));
  };

  const handleClearMeal = () => {
    setMealItems([]);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_MEALS.find(p => p.id === presetId);
    if (!preset) return;

    const newItems: MealItem[] = preset.dishIds.map(ref => {
      const dish = FOOD_DISHES.find(d => d.id === ref.id);
      return dish ? { dish, servings: ref.servings } : null;
    }).filter(Boolean) as MealItem[];

    setMealItems(newItems);
  };

  const handleCompareWith = (dish: FoodDish) => {
    // If dish is pakistani, pair with an iconic indian dish, and vice versa!
    if (dish.cuisine === 'pakistani') {
      setComparePair({ id1: 'butter-chicken', id2: dish.id });
    } else {
      setComparePair({ id1: dish.id, id2: 'chicken-karahi-pakistani' });
    }
    setCurrentTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalMealCalories = mealItems.reduce((acc, i) => acc + i.dish.calories * i.servings, 0);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currency={currency}
        onCurrencyChange={setCurrency}
        mealItemCount={mealItems.length}
        mealCalories={totalMealCalories}
        onOpenMealDrawer={() => setIsMealDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tab 1: Dish Explorer & Individual Benchmark Bars */}
        {currentTab === 'explorer' && (
          <div className="space-y-6">
            {/* Quick Hero Banner */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                  <span className="uppercase tracking-wider">Desi Nutritional & Price Index</span>
                  <span>·</span>
                  <span className="text-stone-300 font-normal">Authentic Indian & Pakistani Cuisine</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Indian & Pakistani Food Average Bar
                </h2>
                <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                  Real culinary data across 50+ quintessential South Asian curries, biryanis, rotis, and street foods. Every item features an instant average bar benchmarking calories against standard daily requirements (2,000 kcal), plus macros, authentic spice heat, and average restaurant prices.
                </p>

                {/* Quick Benchmark Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-stone-700/60 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Avg Pakistani Dish</span>
                    <strong className="text-emerald-400 font-mono text-sm">512 kcal · 32g protein</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Avg Indian Dish</span>
                    <strong className="text-orange-400 font-mono text-sm">424 kcal · 22g protein</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Vegetarian Diversity</span>
                    <strong className="text-amber-300 font-mono text-sm">62% plant-forward</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Standard Daily Target</span>
                    <strong className="text-white font-mono text-sm">2,000 kcal / 65g protein</strong>
                  </div>
                </div>
              </div>

              {/* Decorative subtle saffron pattern glow */}
              <div className="absolute right-0 bottom-0 top-0 w-80 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent pointer-events-none" />
            </div>

            {/* Filter & Search Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTERS)}
              totalResults={filteredDishes.length}
            />

            {/* Dish Cards Grid */}
            {filteredDishes.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
                <Utensils className="w-10 h-10 mx-auto text-stone-300 mb-3" />
                <h3 className="text-sm font-bold text-stone-800">No dishes match your filters</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                  Try adjusting the cuisine tab, clearing your search query, or unchecking dietary filters.
                </p>
                <button
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="mt-4 px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-black transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDishes.map(dish => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    currency={currency}
                    isInMeal={mealItems.some(i => i.dish.id === dish.id)}
                    onAddToMeal={handleAddToMeal}
                    onOpenDetails={setDetailModalDish}
                    onCompareWith={handleCompareWith}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Cuisine Average Bar (Aggregates & Culinary Differences) */}
        {currentTab === 'cuisineAverages' && (
          <CuisineAverageDashboard
            currency={currency}
            onSelectDishToInspect={dishId => {
              const found = FOOD_DISHES.find(d => d.id === dishId);
              if (found) setDetailModalDish(found);
            }}
          />
        )}

        {/* Tab 3: Head-to-Head Comparative Bar */}
        {currentTab === 'compare' && (
          <HeadToHeadCompare
            initialDishId1={comparePair.id1}
            initialDishId2={comparePair.id2}
            currency={currency}
            onAddToMeal={handleAddToMeal}
          />
        )}
      </main>

      {/* Floating Quick Drawer Launcher for Mobile / Convenience */}
      {mealItems.length > 0 && !isMealDrawerOpen && (
        <div className="fixed bottom-5 right-5 z-30">
          <button
            onClick={() => setIsMealDrawerOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-stone-900 hover:bg-black text-white rounded-full shadow-lg border border-stone-700 transition-all transform hover:scale-105"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center">
              {mealItems.length}
            </div>
            <div className="text-left text-xs">
              <span className="font-semibold block leading-tight">View Average Bar Plate</span>
              <span className="text-[10px] text-stone-300 font-mono">
                {Math.round(totalMealCalories)} kcal total
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}

      {/* My Thali / Plate Drawer */}
      <MealPlateDrawer
        isOpen={isMealDrawerOpen}
        onClose={() => setIsMealDrawerOpen(false)}
        mealItems={mealItems}
        onUpdateServings={handleUpdateServings}
        onRemoveItem={handleRemoveFromMeal}
        onClearMeal={handleClearMeal}
        onLoadPreset={handleLoadPreset}
        currency={currency}
      />

      {/* Dish Detailed Nutrition & Facts Modal */}
      <DishDetailModal
        dish={detailModalDish}
        onClose={() => setDetailModalDish(null)}
        currency={currency}
        isInMeal={detailModalDish ? mealItems.some(i => i.dish.id === detailModalDish.id) : false}
        onAddToMeal={handleAddToMeal}
        onCompareWith={handleCompareWith}
      />

      {/* Subtle Footer */}
      <footer className="mt-12 bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-stone-700">
            DesiMacro · Indian & Pakistani Food Nutritional & Price Average Bar
          </p>
          <p className="text-[11px] text-stone-400">
            Nutritional references calibrated with ICMR-NIN & Pakistan Dietary Guidelines. Individual cooking ghee/oil portions may vary.
          </p>
        </div>
      </footer>
    </div>
  );
}
