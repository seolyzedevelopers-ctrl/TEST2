import React from 'react';
import { FoodDish, CurrencyType } from '../types/food';
import { formatPrice, getSpiceLabel } from '../utils/formatters';
import { AverageBarGauge } from './AverageBarGauge';
import { X, Flame, Plus, Check, ArrowLeftRight, Sparkles, ChefHat, HeartPulse } from 'lucide-react';

interface DishDetailModalProps {
  dish: FoodDish | null;
  onClose: () => void;
  currency: CurrencyType;
  isInMeal: boolean;
  onAddToMeal: (dish: FoodDish) => void;
  onCompareWith: (dish: FoodDish) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  currency,
  isInMeal,
  onAddToMeal,
  onCompareWith
}) => {
  if (!dish) return null;

  const spiceInfo = getSpiceLabel(dish.spiceLevel);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in-50 zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 bg-stone-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <span className="uppercase tracking-wider">{dish.cuisine} Cuisine</span>
            <span>·</span>
            <span className="text-stone-300 font-normal">{dish.region}</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">{dish.name}</h2>
          <p className="text-sm text-stone-400 font-serif mt-0.5">{dish.nativeName}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-3 border-t border-stone-800">
            <span>{dish.servingUnit} ({dish.servingWeightGrams}g)</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="font-mono text-amber-300 font-semibold text-sm">
              {formatPrice(dish, currency)}
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="flex items-center gap-1 text-red-400">
              <Flame className="w-3.5 h-3.5" />
              {spiceInfo.label}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Description */}
          <div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Average Bar Benchmark Section */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3.5">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-amber-600" />
              <span>Nutritional Average Benchmarks (Per Single Serving)</span>
            </h4>

            {/* Calorie Bar */}
            <AverageBarGauge
              label="Calories"
              currentValue={dish.calories}
              benchmarkValue={2000}
              unit=" kcal"
              colorScheme="amber"
              benchmarkLabel="Standard Daily (2000 kcal)"
            />

            {/* Protein Bar */}
            <AverageBarGauge
              label="Protein"
              currentValue={dish.protein}
              benchmarkValue={65}
              unit="g"
              colorScheme="emerald"
              benchmarkLabel="Standard Daily (65g)"
            />

            {/* Fat Bar */}
            <AverageBarGauge
              label="Total Fat"
              currentValue={dish.fat}
              benchmarkValue={65}
              unit="g"
              colorScheme="rose"
              benchmarkLabel="Daily Upper Benchmark (65g)"
            />

            {/* Carbs Bar */}
            <AverageBarGauge
              label="Carbohydrates"
              currentValue={dish.carbs}
              benchmarkValue={260}
              unit="g"
              colorScheme="sky"
              benchmarkLabel="Daily Benchmark (260g)"
            />

            {/* Sodium Bar */}
            <AverageBarGauge
              label="Sodium"
              currentValue={dish.sodium}
              benchmarkValue={2300}
              unit="mg"
              colorScheme="rose"
              benchmarkLabel="Daily Limit (2300mg)"
            />
          </div>

          {/* Detailed Nutritional Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/80">
              <span className="text-[10px] text-stone-400 block font-medium">Saturated Fat</span>
              <span className="font-bold text-stone-800 font-mono text-sm">{dish.saturatedFat}g</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/80">
              <span className="text-[10px] text-stone-400 block font-medium">Dietary Fiber</span>
              <span className="font-bold text-emerald-700 font-mono text-sm">{dish.fiber}g</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/80">
              <span className="text-[10px] text-stone-400 block font-medium">Glycemic Index</span>
              <span className={`font-bold text-sm ${
                dish.glycemicIndex === 'Low' ? 'text-emerald-700' :
                dish.glycemicIndex === 'Medium' ? 'text-amber-700' : 'text-red-700'
              }`}>{dish.glycemicIndex}</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/80">
              <span className="text-[10px] text-stone-400 block font-medium">Protein Efficiency</span>
              <span className="font-bold text-stone-800 font-mono text-sm">{dish.proteinRatio}%</span>
            </div>
          </div>

          {/* Key Authentic Ingredients */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 mb-2 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-stone-600" />
              <span>Authentic Spices & Key Ingredients</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {dish.keyIngredients.map(ing => (
                <span
                  key={ing}
                  className="px-2.5 py-1 text-xs bg-stone-100 text-stone-700 rounded-md border border-stone-200/60"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Healthy Swap / Optimization Tip */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block text-amber-950 mb-0.5">Nutritional Calibration Tip</span>
                <p className="leading-relaxed text-amber-800 text-[11px]">
                  {dish.healthySwapTip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onCompareWith(dish);
              onClose();
            }}
            className="py-2 px-3 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Compare Head-to-Head</span>
          </button>

          <button
            onClick={() => {
              onAddToMeal(dish);
            }}
            className={`py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isInMeal
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-black text-white'
            }`}
          >
            {isInMeal ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Thali</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to My Thali / Plate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
