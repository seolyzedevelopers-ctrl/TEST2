import React, { useState } from 'react';
import { MealItem, FoodDish, CurrencyType, NutritionTarget } from '../types/food';
import { NUTRITION_TARGETS, FOOD_DISHES } from '../data/dishes';
import { PRESET_MEALS } from '../data/presets';
import { AverageBarGauge } from './AverageBarGauge';
import { formatCurrencyAmount, formatPrice, getSpiceLabel } from '../utils/formatters';
import { Trash2, Plus, Minus, X, Sparkles, Copy, Check, Utensils, AlertCircle } from 'lucide-react';

interface MealPlateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mealItems: MealItem[];
  onUpdateServings: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearMeal: () => void;
  onLoadPreset: (presetId: string) => void;
  currency: CurrencyType;
}

export const MealPlateDrawer: React.FC<MealPlateDrawerProps> = ({
  isOpen,
  onClose,
  mealItems,
  onUpdateServings,
  onRemoveItem,
  onClearMeal,
  onLoadPreset,
  currency
}) => {
  const [selectedTargetKey, setSelectedTargetKey] = useState<string>('standard');
  const [copied, setCopied] = useState(false);

  const target: NutritionTarget = NUTRITION_TARGETS[selectedTargetKey] || NUTRITION_TARGETS.standard;
  const singleMealCalorieTarget = Math.round(target.calories / 3);

  // Calculate totals
  const totalCalories = mealItems.reduce((acc, item) => acc + item.dish.calories * item.servings, 0);
  const totalProtein = mealItems.reduce((acc, item) => acc + item.dish.protein * item.servings, 0);
  const totalCarbs = mealItems.reduce((acc, item) => acc + item.dish.carbs * item.servings, 0);
  const totalFat = mealItems.reduce((acc, item) => acc + item.dish.fat * item.servings, 0);
  const totalSodium = mealItems.reduce((acc, item) => acc + item.dish.sodium * item.servings, 0);
  const totalFiber = mealItems.reduce((acc, item) => acc + item.dish.fiber * item.servings, 0);
  const totalPriceUSD = mealItems.reduce((acc, item) => acc + item.dish.priceUSD * item.servings, 0);
  const totalWeightGrams = mealItems.reduce((acc, item) => acc + item.dish.servingWeightGrams * item.servings, 0);

  const averageSpice = mealItems.length > 0
    ? (mealItems.reduce((acc, item) => acc + item.dish.spiceLevel * item.servings, 0) / 
       mealItems.reduce((acc, item) => acc + item.servings, 0)).toFixed(1)
    : '0';

  // Smart Rebalance Recommendation
  const getSmartSwapRecommendation = () => {
    if (mealItems.length === 0) return null;

    const hasGarlicNaan = mealItems.find(i => i.dish.id === 'garlic-butter-naan');
    const hasButterChicken = mealItems.find(i => i.dish.id === 'butter-chicken');
    const hasSamosa = mealItems.find(i => i.dish.id === 'samosa-aloo-2pc');
    const hasBiryani = mealItems.find(i => i.dish.id.includes('biryani'));

    if (hasGarlicNaan) {
      return {
        title: 'Swap Garlic Butter Naan for Whole Wheat Tandoori Roti',
        benefit: 'Saves 220 calories, reduces saturated fat by 6.7g, and boosts dietary fiber by 1g.',
        actionDish: FOOD_DISHES.find(d => d.id === 'tandoori-roti')
      };
    }
    if (hasButterChicken) {
      return {
        title: 'Pair with Tandoori Chicken Tikka instead of Heavy Cream Gravy',
        benefit: 'Cuts 180 kcal of butterfat and increases clean protein by +14g.',
        actionDish: FOOD_DISHES.find(d => d.id === 'tandoori-chicken-half')
      };
    }
    if (hasSamosa) {
      return {
        title: 'Swap Fried Samosas for Chicken Seekh Kababs',
        benefit: 'Replaces 26g of deep-fry fat with 34g of lean charcoal-grilled protein.',
        actionDish: FOOD_DISHES.find(d => d.id === 'seekh-kabab-chicken')
      };
    }
    if (hasBiryani && !mealItems.some(i => i.dish.id === 'namkeen-chaas')) {
      return {
        title: 'Add Probiotic Spiced Chaas (Buttermilk)',
        benefit: 'Low-calorie hydration (65 kcal) that aids digestion and buffers spice heat.',
        actionDish: FOOD_DISHES.find(d => d.id === 'namkeen-chaas')
      };
    }

    return null;
  };

  const smartSwap = getSmartSwapRecommendation();

  const handleCopyReceipt = () => {
    if (mealItems.length === 0) return;
    const textLines = [
      `🍱 DesiMacro Meal Plate Breakdown`,
      `==============================`,
      ...mealItems.map(
        i => `• ${i.dish.name} (${i.servings}x) - ${Math.round(i.dish.calories * i.servings)} kcal | ${Math.round(i.dish.protein * i.servings)}g Protein`
      ),
      `------------------------------`,
      `Total Calories: ${Math.round(totalCalories)} kcal (${Math.round((totalCalories / target.calories) * 100)}% of daily avg)`,
      `Total Protein: ${Math.round(totalProtein)}g (${Math.round((totalProtein / target.protein) * 100)}% of daily avg)`,
      `Total Carbs: ${Math.round(totalCarbs)}g | Fat: ${Math.round(totalFat)}g | Fiber: ${Math.round(totalFiber)}g`,
      `Estimated Price: ${formatCurrencyAmount(totalPriceUSD, currency)}`,
      `Average Spice Level: ${averageSpice} / 5`
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">My Desi Thali / Dastarkhwan</h3>
              <p className="text-[11px] text-stone-400">
                {mealItems.length} item{mealItems.length !== 1 ? 's' : ''} on plate · Total {Math.round(totalCalories)} kcal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {mealItems.length > 0 && (
              <button
                onClick={handleCopyReceipt}
                className="text-xs px-2.5 py-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded-md transition-colors flex items-center gap-1"
                title="Copy nutrition summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Target Profile Bar */}
        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Daily Benchmark Target:</span>
          <select
            value={selectedTargetKey}
            onChange={e => setSelectedTargetKey(e.target.value)}
            className="text-xs bg-white border border-stone-300 rounded-md px-2 py-1 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {Object.entries(NUTRITION_TARGETS).map(([key, t]) => (
              <option key={key} value={key}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Preset Thali / Dastarkhwan buttons */}
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
              Load Classic South Asian Combos
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_MEALS.slice(0, 4).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => onLoadPreset(preset.id)}
                  className="text-left p-2.5 rounded-lg border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-xs group"
                >
                  <span className="font-semibold text-stone-900 group-hover:text-amber-800 block truncate">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate mt-0.5">
                    {preset.cuisineTag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC AVERAGE BARS SECTION */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Live Average Bar Benchmarks
              </h4>
              <span className="text-[11px] font-mono text-stone-600">
                Est. {formatCurrencyAmount(totalPriceUSD, currency)}
              </span>
            </div>

            {/* Calories Bar */}
            <AverageBarGauge
              label="Calories"
              currentValue={totalCalories}
              benchmarkValue={target.calories}
              unit=" kcal"
              colorScheme={totalCalories > target.calories ? 'rose' : totalCalories > singleMealCalorieTarget * 1.5 ? 'amber' : 'emerald'}
              benchmarkLabel="Daily 100%"
            />

            {/* Protein Bar */}
            <AverageBarGauge
              label="Protein"
              currentValue={totalProtein}
              benchmarkValue={target.protein}
              unit="g"
              colorScheme="emerald"
              benchmarkLabel="Daily Target"
            />

            {/* Carbs Bar */}
            <AverageBarGauge
              label="Carbohydrates"
              currentValue={totalCarbs}
              benchmarkValue={target.carbs}
              unit="g"
              colorScheme="sky"
              benchmarkLabel="Daily Limit"
            />

            {/* Fat Bar */}
            <AverageBarGauge
              label="Total Fats"
              currentValue={totalFat}
              benchmarkValue={target.fat}
              unit="g"
              colorScheme={totalFat > target.fat ? 'rose' : 'orange'}
              benchmarkLabel="Daily Limit"
            />

            {/* Sodium Bar */}
            <AverageBarGauge
              label="Sodium"
              currentValue={totalSodium}
              benchmarkValue={target.sodium}
              unit="mg"
              colorScheme={totalSodium > target.sodium ? 'rose' : 'amber'}
              benchmarkLabel="Daily 2300mg"
            />

            {/* Spice and Weight Stats */}
            <div className="pt-2 border-t border-stone-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block">Avg Spice</span>
                <span className="font-bold text-red-600 font-mono">{averageSpice} / 5</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block">Dietary Fiber</span>
                <span className="font-bold text-emerald-700 font-mono">{Math.round(totalFiber)}g</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block">Plate Weight</span>
                <span className="font-bold text-stone-800 font-mono">{Math.round(totalWeightGrams)}g</span>
              </div>
            </div>
          </div>

          {/* Smart Healthier Swap Alert */}
          {smartSwap && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 block">
                    Healthier Average Suggestion
                  </span>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    <strong>{smartSwap.title}</strong>: {smartSwap.benefit}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Items on Plate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Dishes on Plate ({mealItems.length})
              </span>
              {mealItems.length > 0 && (
                <button
                  onClick={onClearMeal}
                  className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Plate</span>
                </button>
              )}
            </div>

            {mealItems.length === 0 ? (
              <div className="text-center py-8 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500">
                <Utensils className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-medium text-stone-700">Your plate is currently empty</p>
                <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                  Add dishes from the explorer or click one of the classic combos above to check average benchmarks.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {mealItems.map(item => (
                  <div
                    key={item.dish.id}
                    className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.dish.cuisine === 'pakistani' ? 'bg-emerald-600' :
                          item.dish.cuisine === 'indian' ? 'bg-orange-500' : 'bg-amber-600'
                        }`} />
                        <h5 className="font-semibold text-stone-900 text-xs truncate">
                          {item.dish.name}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="font-mono text-stone-700 font-medium">
                          {Math.round(item.dish.calories * item.servings)} kcal
                        </span>
                        <span>·</span>
                        <span className="font-mono text-emerald-700 font-medium">
                          {Math.round(item.dish.protein * item.servings)}g protein
                        </span>
                        <span>·</span>
                        <span>{formatPrice(item.dish, currency)}</span>
                      </div>
                    </div>

                    {/* Portion Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50 text-xs">
                        <button
                          onClick={() => onUpdateServings(item.dish.id, -0.5)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          title="Reduce portion"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-medium text-stone-800 text-xs">
                          {item.servings}x
                        </span>
                        <button
                          onClick={() => onUpdateServings(item.dish.id, 0.5)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          title="Increase portion"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.dish.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-md transition-colors"
                        title="Remove dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-500 block">Total Est. Price</span>
            <span className="font-bold text-stone-900 font-mono text-sm">
              {formatCurrencyAmount(totalPriceUSD, currency)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white font-medium rounded-lg text-xs transition-colors"
          >
            Done Adjusting
          </button>
        </div>
      </div>
    </div>
  );
};
