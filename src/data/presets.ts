export interface PresetMeal {
  id: string;
  name: string;
  cuisineTag: 'Pakistani Classic' | 'Indian Classic' | 'Shared Tradition' | 'High Protein' | 'Street Crawl';
  description: string;
  dishIds: { id: string; servings: number }[];
}

export const PRESET_MEALS: PresetMeal[] = [
  {
    id: 'lahore-dastarkhwan',
    name: 'Lahori Shahi Dastarkhwan',
    cuisineTag: 'Pakistani Classic',
    description: 'Slow-cooked Beef Nihari with sesame Roghani Naan, rich Bone-Marrow Pulao, and sweet Shahi Kheer.',
    dishIds: [
      { id: 'nihari-beef', servings: 1 },
      { id: 'roghani-naan', servings: 1 },
      { id: 'kheer-phirni', servings: 1 }
    ]
  },
  {
    id: 'delhi-royal-thali',
    name: 'Old Delhi Royal Shahi Thali',
    cuisineTag: 'Indian Classic',
    description: 'Velvety Butter Chicken with Garlic Naan, overnight Dal Makhani, and warm Gulab Jamun.',
    dishIds: [
      { id: 'butter-chicken', servings: 1 },
      { id: 'garlic-butter-naan', servings: 1 },
      { id: 'dal-makhani', servings: 0.5 },
      { id: 'gulab-jamun', servings: 1 }
    ]
  },
  {
    id: 'karachi-bbq-biryani',
    name: 'Karachi Biryani & BBQ Night',
    cuisineTag: 'Pakistani Classic',
    description: 'Spicy Karachi Beef Biryani, tender Bihari Boti, cooling Mint Chaas, and fresh salad.',
    dishIds: [
      { id: 'biryani-karachi-beef', servings: 1 },
      { id: 'bihari-boti-kabab', servings: 0.5 },
      { id: 'namkeen-chaas', servings: 1 }
    ]
  },
  {
    id: 'desi-bodybuilder',
    name: 'Subcontinent Muscle & Fitness Plate',
    cuisineTag: 'High Protein',
    description: 'Charcoal Tandoori Chicken, lean Chicken Seekh Kababs, high-fiber Tandoori Roti, and yellow dal.',
    dishIds: [
      { id: 'tandoori-chicken-half', servings: 1 },
      { id: 'seekh-kabab-chicken', servings: 1 },
      { id: 'tandoori-roti', servings: 2 },
      { id: 'dal-tadka-yellow', servings: 0.5 }
    ]
  },
  {
    id: 'punjabi-pure-veg',
    name: 'Amritsari Pure Veg Thali',
    cuisineTag: 'Indian Classic',
    description: 'Iron-rich Palak Paneer, fragrant Chana Masala, soft whole wheat Phulkas, and saffron Rasmalai.',
    dishIds: [
      { id: 'palak-paneer', servings: 1 },
      { id: 'chana-masala', servings: 0.5 },
      { id: 'phulka-chapati', servings: 2 },
      { id: 'rasmalai', servings: 1 }
    ]
  },
  {
    id: 'street-food-binge',
    name: 'Karachi to Chandni Chowk Street Crawl',
    cuisineTag: 'Street Crawl',
    description: 'Pani Puri / Gol Gappe, crispy Aloo Samosas, Karachi Bun Kabab, and sweet Mango Lassi.',
    dishIds: [
      { id: 'pani-puri-gol-gappe', servings: 1 },
      { id: 'samosa-aloo-2pc', servings: 1 },
      { id: 'bun-kabab-karachi', servings: 1 },
      { id: 'mango-lassi', servings: 1 }
    ]
  }
];
