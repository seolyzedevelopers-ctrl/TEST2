import React from 'react';
import { FoodDish, CurrencyType } from '../types/food';
import { formatPrice, getSpiceLabel } from '../utils/formatters';
import { Plus, Check, ArrowLeftRight, Flame, Clock } from 'lucide-react';

interface DishCardProps {
  dish: FoodDish;
  currency: CurrencyType;
  isInMeal: boolean;
  onAddToMeal: (dish: FoodDish) => void;
  onOpenDetails: (dish: FoodDish) => void;
  onCompareWith: (dish: FoodDish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  currency,
  isInMeal,
  onAddToMeal,
  onOpenDetails,
  onCompareWith
}) => {
  const spiceInfo = getSpiceLabel(dish.spiceLevel);
  const calPercentOfDaily = Math.min(100, Math.round((dish.calories / 2000) * 100));

  const cuisineTheme = {
    pakistani: {
      dot: 'bg-emerald-600',
      label: 'Pakistani',
      text: 'text-emerald-800'
    },
    indian: {
      dot: 'bg-orange-500',
      label: 'Indian',
      text: 'text-orange-800'
    },
    shared: {
      dot: 'bg-amber-600',
      label: 'Shared Subcontinent',
      text: 'text-amber-800'
    }
  }[dish.cuisine];

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-4">
        {/* Top Unboxed Metadata (Zero-pill compliant) */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-2 h-2 rounded-full ${cuisineTheme.dot}`} />
            <span className={cuisineTheme.text}>{cuisineTheme.label}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate max-w-[140px]">{dish.region}</span>
          </div>
          <span className="font-mono text-stone-900 font-semibold text-xs">
            {formatPrice(dish, currency)}
          </span>
        </div>

        {/* Title & Native Script */}
        <div className="mb-2">
          <h3 
            onClick={() => onOpenDetails(dish)}
            className="font-bold text-stone-900 text-sm hover:text-amber-700 cursor-pointer transition-colors leading-snug"
          >
            {dish.name}
          </h3>
          <p className="text-[11px] text-stone-400 font-serif mt-0.5">{dish.nativeName}</p>
        </div>

        {/* Serving Unit & Prep Time */}
        <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-3">
          <span>{dish.servingUnit}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            {dish.prepTimeMin}m
          </span>
        </div>

        {/* Calorie Average Bar */}
        <div className="mb-3 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
          <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
            <span className="text-stone-600">Calories: <strong className="text-stone-900 font-mono">{dish.calories}</strong> kcal</span>
            <span className="text-stone-500 text-[10px]">{calPercentOfDaily}% of daily avg</span>
          </div>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                calPercentOfDaily > 35 ? 'bg-amber-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${calPercentOfDaily}%` }}
            />
          </div>

          {/* Quick Macros Row */}
          <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-stone-200/50 text-[10px] text-center font-mono">
            <div>
              <span className="text-stone-600 block text-[9px] font-sans">Protein</span>
              <span className="font-semibold text-emerald-800">{dish.protein}g</span>
            </div>
            <div>
              <span className="text-stone-600 block text-[9px] font-sans">Carbs</span>
              <span className="font-semibold text-stone-700">{dish.carbs}g</span>
            </div>
            <div>
              <span className="text-stone-600 block text-[9px] font-sans">Fat</span>
              <span className="font-semibold text-amber-800">{dish.fat}g</span>
            </div>
          </div>
        </div>

        {/* Spice Level & Dietary Inline Text */}
        <div className="flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span className={spiceInfo.color}>{spiceInfo.label}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            {dish.dietary.slice(0, 2).map((tag, idx) => (
              <React.Fragment key={tag}>
                {idx > 0 && <span aria-hidden="true" className="text-stone-300">/</span>}
                <span>{tag}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-stone-50/70 border-t border-stone-100 flex items-center gap-1.5">
        <button
          onClick={() => onAddToMeal(dish)}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            isInMeal
              ? 'bg-emerald-700 text-white'
              : 'bg-stone-900 hover:bg-black text-white'
          }`}
        >
          {isInMeal ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Plate</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Plate</span>
            </>
          )}
        </button>

        <button
          onClick={() => onCompareWith(dish)}
          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
          title="Compare head-to-head"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
