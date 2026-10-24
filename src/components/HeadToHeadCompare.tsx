import React, { useState } from 'react';
import { FoodDish, CurrencyType } from '../types/food';
import { FOOD_DISHES } from '../data/dishes';
import { formatPrice, getSpiceLabel } from '../utils/formatters';
import { ArrowLeftRight, Check, Flame, Trophy, ShieldAlert, Sparkles } from 'lucide-react';

interface HeadToHeadCompareProps {
  initialDishId1?: string;
  initialDishId2?: string;
  currency: CurrencyType;
  onAddToMeal: (dish: FoodDish) => void;
}

export const HeadToHeadCompare: React.FC<HeadToHeadCompareProps> = ({
  initialDishId1 = 'butter-chicken',
  initialDishId2 = 'chicken-karahi-pakistani',
  currency,
  onAddToMeal
}) => {
  const [dishId1, setDishId1] = useState<string>(initialDishId1);
  const [dishId2, setDishId2] = useState<string>(initialDishId2);

  const dish1 = FOOD_DISHES.find(d => d.id === dishId1) || FOOD_DISHES[0];
  const dish2 = FOOD_DISHES.find(d => d.id === dishId2) || FOOD_DISHES[1];

  // Helper comparison bar
  const renderComparisonBar = (
    label: string,
    val1: number,
    val2: number,
    unit: string,
    lowerIsBetter = false
  ) => {
    const max = Math.max(val1, val2, 1);
    const p1 = (val1 / max) * 100;
    const p2 = (val2 / max) * 100;

    const winner1 = lowerIsBetter ? val1 < val2 : val1 > val2;
    const winner2 = lowerIsBetter ? val2 < val1 : val2 > val1;
    const isTie = val1 === val2;

    return (
      <div className="py-2.5 border-b border-stone-100 last:border-0">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-stone-700">
          <span className={`font-mono text-xs ${winner1 ? 'text-emerald-700 font-bold' : 'text-stone-700'}`}>
            {val1}{unit} {winner1 && !isTie && <span className="text-[10px] ml-0.5">★</span>}
          </span>
          <span className="text-stone-500 font-sans">{label}</span>
          <span className={`font-mono text-xs ${winner2 ? 'text-emerald-700 font-bold' : 'text-stone-700'}`}>
            {val2}{unit} {winner2 && !isTie && <span className="text-[10px] ml-0.5">★</span>}
          </span>
        </div>

        {/* Dual facing comparison bars */}
        <div className="grid grid-cols-2 gap-2 h-2.5">
          {/* Dish 1 bar (aligned right to center) */}
          <div className="w-full bg-stone-100 rounded-l-full overflow-hidden flex justify-end">
            <div
              className={`h-full rounded-l-full transition-all duration-500 ${
                winner1 ? 'bg-orange-500' : 'bg-stone-400'
              }`}
              style={{ width: `${p1}%` }}
            />
          </div>

          {/* Dish 2 bar (aligned left to center) */}
          <div className="w-full bg-stone-100 rounded-r-full overflow-hidden flex justify-start">
            <div
              className={`h-full rounded-r-full transition-all duration-500 ${
                winner2 ? 'bg-emerald-600' : 'bg-stone-400'
              }`}
              style={{ width: `${p2}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Quick preset pairs
  const quickPairs = [
    { label: 'Butter Chicken vs Pakistani Karahi', id1: 'butter-chicken', id2: 'chicken-karahi-pakistani' },
    { label: 'Karachi Biryani vs Hyderabadi Biryani', id1: 'biryani-karachi-beef', id2: 'biryani-hyderabadi-mutton' },
    { label: 'Beef Nihari vs Mutton Haleem', id1: 'nihari-beef', id2: 'haleem-mutton' },
    { label: 'Garlic Butter Naan vs Tandoori Roti', id1: 'garlic-butter-naan', id2: 'tandoori-roti' },
    { label: 'Chapli Kabab vs Tandoori Chicken', id1: 'chapli-kabab', id2: 'tandoori-chicken-half' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Pair Shortcuts */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-amber-600" />
              <span>Head-to-Head Dish Comparison Bar</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Compare nutritional averages, protein efficiency, and calories side-by-side.
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 font-medium mr-1">Quick Matchups:</span>
            {quickPairs.map(qp => (
              <button
                key={qp.label}
                onClick={() => {
                  setDishId1(qp.id1);
                  setDishId2(qp.id2);
                }}
                className="text-[11px] px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dish Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-100">
          <div>
            <label className="block text-xs font-semibold text-orange-950 mb-1.5">
              Select First Dish (Left)
            </label>
            <select
              value={dishId1}
              onChange={e => setDishId1(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {FOOD_DISHES.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.cuisine.toUpperCase()}) - {d.calories} kcal
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-950 mb-1.5">
              Select Second Dish (Right)
            </label>
            <select
              value={dishId2}
              onChange={e => setDishId2(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {FOOD_DISHES.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.cuisine.toUpperCase()}) - {d.calories} kcal
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Main Stage */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Top Header of the 2 Selected Dishes */}
        <div className="grid grid-cols-2 border-b border-stone-200">
          {/* Dish 1 Header */}
          <div className="p-5 border-r border-stone-200 bg-orange-50/30">
            <div className="flex items-center gap-2 text-xs text-orange-800 font-semibold mb-1">
              <span className="uppercase tracking-wider">{dish1.cuisine} Cuisine</span>
              <span>·</span>
              <span className="font-normal text-stone-500">{dish1.region}</span>
            </div>
            <h3 className="font-bold text-stone-900 text-lg leading-tight">{dish1.name}</h3>
            <p className="text-xs text-stone-500 font-serif mt-0.5">{dish1.nativeName}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-stone-500">{dish1.servingUnit}</span>
              <span className="font-bold text-stone-900 font-mono text-sm">
                {formatPrice(dish1, currency)}
              </span>
            </div>
            <button
              onClick={() => onAddToMeal(dish1)}
              className="mt-3 w-full py-1.5 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              + Add to My Meal Plate
            </button>
          </div>

          {/* Dish 2 Header */}
          <div className="p-5 bg-emerald-50/30">
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
              <span className="uppercase tracking-wider">{dish2.cuisine} Cuisine</span>
              <span>·</span>
              <span className="font-normal text-stone-500">{dish2.region}</span>
            </div>
            <h3 className="font-bold text-stone-900 text-lg leading-tight">{dish2.name}</h3>
            <p className="text-xs text-stone-500 font-serif mt-0.5">{dish2.nativeName}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-stone-500">{dish2.servingUnit}</span>
              <span className="font-bold text-stone-900 font-mono text-sm">
                {formatPrice(dish2, currency)}
              </span>
            </div>
            <button
              onClick={() => onAddToMeal(dish2)}
              className="mt-3 w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors"
            >
              + Add to My Meal Plate
            </button>
          </div>
        </div>

        {/* Bars Section */}
        <div className="p-6">
          <div className="text-center text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
            Macro & Micronutrient Comparison Bar
          </div>

          {renderComparisonBar('Calories (Lower is lighter)', dish1.calories, dish2.calories, ' kcal', true)}
          {renderComparisonBar('Protein (Muscle & Satiety)', dish1.protein, dish2.protein, 'g', false)}
          {renderComparisonBar('Protein-to-Calorie Ratio', dish1.proteinRatio, dish2.proteinRatio, '%', false)}
          {renderComparisonBar('Total Fat', dish1.fat, dish2.fat, 'g', true)}
          {renderComparisonBar('Saturated Fat', dish1.saturatedFat, dish2.saturatedFat, 'g', true)}
          {renderComparisonBar('Carbohydrates', dish1.carbs, dish2.carbs, 'g', false)}
          {renderComparisonBar('Dietary Fiber', dish1.fiber, dish2.fiber, 'g', false)}
          {renderComparisonBar('Sodium Content', dish1.sodium, dish2.sodium, 'mg', true)}
          {renderComparisonBar('Spice Intensity Level', dish1.spiceLevel, dish2.spiceLevel, '/5', false)}
        </div>

        {/* Nutritional Verdict Breakdown */}
        <div className="p-5 bg-stone-50 border-t border-stone-200">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 mb-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Health & Fitness Verdict</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700">
            <div className="bg-white p-3.5 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">
                When to choose {dish1.name}:
              </span>
              <p className="text-stone-600 leading-relaxed">
                {dish1.healthySwapTip}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">
                When to choose {dish2.name}:
              </span>
              <p className="text-stone-600 leading-relaxed">
                {dish2.healthySwapTip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
