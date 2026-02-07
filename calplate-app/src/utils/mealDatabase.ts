
export interface FoodItem {
    name: string;
    calories: number;
    type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface Recipe {
    id: string;
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    prepTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    dietary: string[];
    season: string[];
    cost: '$' | '$$' | '$$$';
    servings: number;
    ingredients: string[];
    instructions: string[];
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    tags: string[];
    tips: string;
    category: 'quick' | 'batch' | 'healthy' | 'seasonal';
}

export const commonFoods: FoodItem[] = [
    { name: 'Banana', calories: 105, type: 'snack' },
    { name: 'Apple', calories: 95, type: 'snack' },
    { name: 'Chicken Breast (100g)', calories: 165, type: 'lunch' },
    { name: 'Rice (1 cup)', calories: 205, type: 'lunch' },
    { name: 'Egg', calories: 70, type: 'breakfast' },
    { name: 'Bread Slice', calories: 80, type: 'breakfast' },
    { name: 'Milk (1 cup)', calories: 150, type: 'breakfast' },
    { name: 'Yogurt', calories: 100, type: 'snack' }
];

export const recipes: Recipe[] = [
    // Quick Meals
    {
        id: '1',
        name: "Greek Yogurt Parfait",
        type: "breakfast",
        calories: 320,
        prepTime: "5 min",
        difficulty: "beginner",
        dietary: ["vegetarian", "gluten-free"],
        season: ["all", "summer"],
        cost: "$",
        servings: 1,
        ingredients: [
            "Greek yogurt (1 cup)",
            "Mixed berries (1/2 cup)",
            "Granola (1/4 cup)",
            "Honey (1 tbsp)"
        ],
        instructions: [
            "Layer half the yogurt in a glass or bowl",
            "Add half the berries and granola",
            "Repeat layers with remaining ingredients",
            "Drizzle honey on top",
            "Serve immediately or chill for later"
        ],
        macros: { protein: 20, carbs: 35, fat: 8 },
        tags: ["High Protein", "Quick", "No Cook"],
        tips: "Make 5 jars at once for weekly breakfast prep",
        category: 'quick'
    },
    {
        id: '2',
        name: "Avocado Toast Power Bowl",
        type: "breakfast",
        calories: 450,
        prepTime: "10 min",
        difficulty: "beginner",
        dietary: ["vegetarian"],
        season: ["spring", "summer"],
        cost: "$$",
        servings: 1,
        ingredients: [
            "Sourdough bread (2 slices)",
            "Avocado (1/2)",
            "Cherry tomatoes (1/2 cup)",
            "Poached egg (1)",
            "Chili flakes"
        ],
        instructions: [
            "Toast the bread until golden.",
            "Mash avocado with salt and pepper.",
            "Spread on toast.",
            "Top with poached egg and tomatoes.",
            "Sprinkle chili flakes."
        ],
        macros: { protein: 18, carbs: 45, fat: 22 },
        tags: ["Trends", "Healthy Fats"],
        tips: "Add lime juice to avocado to prevent browning.",
        category: 'quick'
    },

    // Batch Cooking
    {
        id: '9',
        name: "Overnight Oats Variety Pack",
        type: "breakfast",
        calories: 350,
        prepTime: "15 min",
        difficulty: "beginner",
        dietary: ["vegetarian", "vegan"],
        season: ["all"],
        cost: "$",
        servings: 5,
        ingredients: ["Rolled oats", "Almond milk", "Chia seeds", "Maple syrup", "Various toppings"],
        instructions: ["Mix oats, milk, seeds, syrup.", "Pour into 5 jars.", "Add different fruits/nuts to each.", "Refrigerate overnight."],
        macros: { protein: 12, carbs: 55, fat: 10 },
        tags: ["Meal Prep", "Fiber"],
        tips: "Use frozen berries for better texture as they thaw.",
        category: 'batch'
    },
    {
        id: '10',
        name: "Sheet Pan Chicken & Veggies",
        type: "dinner",
        calories: 420,
        prepTime: "45 min",
        difficulty: "beginner",
        dietary: ["gluten-free", "paleo"],
        season: ["all"],
        cost: "$$",
        servings: 6,
        ingredients: ["Chicken breast (2 lbs)", "Broccoli", "Bell peppers", "Sweet potatoes", "Olive oil", "Herbs"],
        instructions: ["Chop all veggies and chicken.", "Toss with oil and herbs.", "Spread on sheet pan.", "Bake at 400°F for 25-30 mins."],
        macros: { protein: 35, carbs: 25, fat: 18 },
        tags: ["High Protein", "Easy Clean Up"],
        tips: "Line pan with parchment paper for easy cleanup.",
        category: 'batch'
    },

    // Healthy Options
    {
        id: '15',
        name: "Antioxidant Smoothie Bowl",
        type: "breakfast",
        calories: 380,
        prepTime: "10 min",
        difficulty: "beginner",
        dietary: ["vegan", "gluten-free"],
        season: ["summer"],
        cost: "$$$",
        servings: 1,
        ingredients: ["Acai packet", "Banana", "Blueberries", "Spinach", "Granola"],
        instructions: ["Blend acai, banana, spinach, splash of water.", "Pour into bowl.", "Top with berries and granola."],
        macros: { protein: 8, carbs: 65, fat: 12 },
        tags: ["Superfood", "Refreshing"],
        tips: "Use a frozen banana for creamier texture.",
        category: 'healthy'
    },
    {
        id: '16',
        name: "Mediterranean Zucchini Boats",
        type: "dinner",
        calories: 320,
        prepTime: "40 min",
        difficulty: "intermediate",
        dietary: ["low-carb", "keto"],
        season: ["summer"],
        cost: "$$",
        servings: 4,
        ingredients: ["Zucchini (4 large)", "Ground turkey", "Tomato sauce", "Mozzarella", "Oregano"],
        instructions: ["Halve zucchinis and scoop out seeds.", "Brown turkey with sauce and herbs.", "Fill boats.", "Top with cheese.", "Bake 20 mins at 375°F."],
        macros: { protein: 28, carbs: 12, fat: 18 },
        tags: ["Keto", "Vegetable Heavy"],
        tips: "Salt zucchini boats and let sit 10 mins to remove excess water.",
        category: 'healthy'
    }
];
