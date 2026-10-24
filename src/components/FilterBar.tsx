import React from 'react';
import { CuisineType, CategoryType, DietaryTag, FilterState } from '../types/food';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) => {
  const cuisineTabs: { id: CuisineType; label: string }[] = [
    { id: 'all', label: 'All Cuisines' },
    { id: 'pakistani', label: 'Pakistani' },
    { id: 'indian', label: 'Indian' },
    { id: 'shared', label: 'Shared Heritage' }
  ];

  const categoryTabs: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'curries', label: 'Curries & Gravies' },
    { id: 'rice', label: 'Biryanis & Rice' },
    { id: 'bbq_kebabs', label: 'BBQ & Kebabs' },
    { id: 'dals_veggies', label: 'Dals & Veggies' },
    { id: 'breads', label: 'Breads & Rotis' },
    { id: 'street_food', label: 'Street Food & Chaats' },
    { id: 'desserts', label: 'Mithai & Desserts' },
    { id: 'beverages', label: 'Beverages' }
  ];

  const dietaryOptions: { tag: DietaryTag; label: string }[] = [
    { tag: 'Halal', label: 'Halal' },
    { tag: 'Pure Veg', label: 'Pure Veg' },
    { tag: 'High Protein', label: 'High Protein (>20g)' },
    { tag: 'Low Carb', label: 'Low Carb' }
  ];

  const toggleDietaryTag = (tag: DietaryTag) => {
    const exists = filters.dietary.includes(tag);
    const newTags = exists
      ? filters.dietary.filter(t => t !== tag)
      : [...filters.dietary, tag];
    onFilterChange({ ...filters, dietary: newTags });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3.5">
      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={e => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search dish (e.g. Biryani, Nihari, Butter Chicken, Naan, Paneer, Daal)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium shrink-0">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={e => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="calories-asc">Calories: Low to High</option>
            <option value="calories-desc">Calories: High to Low</option>
            <option value="protein-desc">Protein: High to Low</option>
            <option value="price-asc">Price: Lowest First</option>
            <option value="spice-desc">Spice: Fiery First</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>

          {/* Reset button if filters active */}
          {(filters.searchQuery || filters.cuisine !== 'all' || filters.category !== 'all' || filters.dietary.length > 0) && (
            <button
              onClick={onResetFilters}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg text-xs transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cuisine Filter Segmented Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100">
        <span className="text-xs font-semibold text-stone-400 mr-1">Cuisine:</span>
        {cuisineTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onFilterChange({ ...filters, cuisine: tab.id })}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filters.cuisine === tab.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="ml-auto text-xs text-stone-500">
          Showing <strong>{totalResults}</strong> dishes
        </div>
      </div>

      {/* Categories Scrollable Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-xs font-semibold text-stone-400 mr-1 shrink-0">Category:</span>
        {categoryTabs.map(cat => (
          <button
            key={cat.id}
            onClick={() => onFilterChange({ ...filters, category: cat.id })}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              filters.category === cat.id
                ? 'bg-amber-100 text-amber-900 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dietary Checkbox Filters */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-stone-100">
        <span className="text-xs font-semibold text-stone-400 mr-1">Dietary Focus:</span>
        {dietaryOptions.map(opt => {
          const active = filters.dietary.includes(opt.tag);
          return (
            <button
              key={opt.tag}
              onClick={() => toggleDietaryTag(opt.tag)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                active
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
