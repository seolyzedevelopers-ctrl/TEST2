import React from 'react';
import { CurrencyType } from '../types/food';
import { CURRENCY_SYMBOLS } from '../utils/formatters';
import { Utensils, BarChart3, Scale, Flame, Compass } from 'lucide-react';

interface HeaderProps {
  currentTab: 'explorer' | 'cuisineAverages' | 'compare';
  onTabChange: (tab: 'explorer' | 'cuisineAverages' | 'compare') => void;
  currency: CurrencyType;
  onCurrencyChange: (currency: CurrencyType) => void;
  mealItemCount: number;
  mealCalories: number;
  onOpenMealDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currency,
  onCurrencyChange,
  mealItemCount,
  mealCalories,
  onOpenMealDrawer
}) => {
  const currencies: CurrencyType[] = ['USD', 'INR', 'PKR', 'GBP', 'EUR'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-stone-900 text-base sm:text-lg tracking-tight leading-none">
                  DesiMacro
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Average Bar
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block mt-0.5">
                Indian & Pakistani Food Nutritional & Price Benchmarks
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => onTabChange('explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'explorer'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Dish Explorer & Benchmarks</span>
            </button>

            <button
              onClick={() => onTabChange('cuisineAverages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'cuisineAverages'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cuisine Average Bar</span>
            </button>

            <button
              onClick={() => onTabChange('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'compare'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-orange-600" />
              <span>Head-to-Head Compare</span>
            </button>
          </nav>

          {/* Right Controls: Currency & Meal Plate Drawer Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Currency Selector */}
            <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50 text-xs">
              {currencies.map(c => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-1.5 py-1 text-[11px] font-mono rounded transition-colors ${
                    currency === c
                      ? 'bg-white text-stone-900 font-bold shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title={`Switch to ${c}`}
                >
                  {CURRENCY_SYMBOLS[c]}
                </button>
              ))}
            </div>

            {/* My Thali / Plate Button */}
            <button
              onClick={onOpenMealDrawer}
              className="relative flex items-center gap-2 py-1.5 px-3 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">My Plate</span>
              {mealItemCount > 0 ? (
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                    {mealItemCount}
                  </span>
                  <span className="text-[11px] text-stone-300 font-mono hidden md:inline">
                    · {Math.round(mealCalories)} kcal
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-stone-400">Empty</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-stone-100 text-xs overflow-x-auto">
          <button
            onClick={() => onTabChange('explorer')}
            className={`py-1 px-2 font-medium whitespace-nowrap rounded ${
              currentTab === 'explorer' ? 'text-amber-800 font-bold bg-amber-50' : 'text-stone-600'
            }`}
          >
            Explorer
          </button>
          <button
            onClick={() => onTabChange('cuisineAverages')}
            className={`py-1 px-2 font-medium whitespace-nowrap rounded ${
              currentTab === 'cuisineAverages' ? 'text-emerald-800 font-bold bg-emerald-50' : 'text-stone-600'
            }`}
          >
            Cuisine Averages
          </button>
          <button
            onClick={() => onTabChange('compare')}
            className={`py-1 px-2 font-medium whitespace-nowrap rounded ${
              currentTab === 'compare' ? 'text-orange-800 font-bold bg-orange-50' : 'text-stone-600'
            }`}
          >
            Compare
          </button>
        </div>
      </div>
    </header>
  );
};
