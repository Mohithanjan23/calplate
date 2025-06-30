import { useState } from 'react';

const MEAL_PLANS = {
  veg: {
    low: {
      "Fat Loss": [
        "Sprouted moong salad + Buttermilk",
        "Oats + boiled veggies",
        "Brown rice + dal + salad"
      ],
      "Muscle Gain": [
        "Paneer bhurji + roti",
        "Chana masala + brown rice",
        "Oats smoothie with banana and peanut butter"
      ],
      "Maintenance": [
        "Vegetable upma + curd",
        "Rice + sambar + cabbage stir-fry",
        "Fruit chaat + milk"
      ]
    },
    medium: {
      "Fat Loss": [
        "Vegetable quinoa + curd",
        "Tofu salad bowl",
        "Bajra roti + mixed veg sabzi"
      ],
      "Muscle Gain": [
        "Paneer curry + rice",
        "Tofu stir-fry + noodles",
        "Protein shake + banana + oats"
      ],
      "Maintenance": [
        "Idli + sambar + peanut chutney",
        "Chapati + palak paneer",
        "Khichdi + ghee + salad"
      ]
    },
    high: {
      "Fat Loss": [
        "Avocado toast + green tea",
        "Broccoli soup + oats chilla",
        "Zucchini noodles + tofu"
      ],
      "Muscle Gain": [
        "Paneer steak + protein pasta",
        "Vegan protein shake + nut mix",
        "Cottage cheese roll + quinoa salad"
      ],
      "Maintenance": [
        "Stuffed paratha + curd",
        "Rice + rajma + paneer tikka",
        "Multi-grain dosa + chutney"
      ]
    }
  },
  nonveg: {
    low: {
      "Fat Loss": [
        "Boiled eggs + cucumber salad",
        "Grilled chicken + spinach",
        "Brown rice + boiled egg curry"
      ],
      "Muscle Gain": [
        "Omelette + bread + milk",
        "Chicken curry + rice",
        "Fish fry + chapati"
      ],
      "Maintenance": [
        "Egg bhurji + chapati",
        "Chicken rice + curd",
        "Fish curry + steamed rice"
      ]
    },
    medium: {
      "Fat Loss": [
        "Grilled fish + sautéed veg",
        "Chicken soup + oats",
        "Boiled egg salad + fruit"
      ],
      "Muscle Gain": [
        "Chicken breast + mashed potato",
        "Mutton curry + brown rice",
        "Egg protein shake + peanut butter toast"
      ],
      "Maintenance": [
        "Egg dosa + sambar",
        "Chicken tikka + salad",
        "Tuna sandwich + juice"
      ]
    },
    high: {
      "Fat Loss": [
        "Salmon bowl + quinoa",
        "Avocado + grilled shrimp",
        "Boiled eggs + lean sausage"
      ],
      "Muscle Gain": [
        "Steak + mashed sweet potatoes",
        "Chicken breast pasta + Greek yogurt",
        "High-protein wrap + nuts"
      ],
      "Maintenance": [
        "Chicken sandwich + fruit",
        "Egg white omelette + avocado toast",
        "Lamb curry + paratha"
      ]
    }
  },
  vegan: {
    low: {
      "Fat Loss": [
        "Sprouts + tomato salad",
        "Lentil soup + brown rice",
        "Steamed veggies + hummus"
      ],
      "Muscle Gain": [
        "Soy nuggets + rice",
        "Tofu wrap + oats",
        "Chickpea curry + quinoa"
      ],
      "Maintenance": [
        "Vegetable stew + roti",
        "Peanut chikki + smoothie",
        "Upma + almond milk"
      ]
    },
    medium: {
      "Fat Loss": [
        "Tofu bowl + barley",
        "Oats smoothie + salad",
        "Lentil patty + soup"
      ],
      "Muscle Gain": [
        "Soy protein shake + peanut butter toast",
        "Vegan pasta + edamame",
        "Bean burrito + nuts"
      ],
      "Maintenance": [
        "Roti + vegan dal makhani",
        "Chickpea chaat + shake",
        "Vegan pancakes + maple syrup"
      ]
    },
    high: {
      "Fat Loss": [
        "Zucchini noodles + tempeh",
        "Avocado salad + soup",
        "Tofu taco bowl"
      ],
      "Muscle Gain": [
        "Beyond meat burger + fries",
        "Quinoa tofu stir-fry + nuts",
        "Soy kebabs + peanut dip"
      ],
      "Maintenance": [
        "Almond milk cereal + fruit",
        "Vegan pizza + protein shake",
        "Tofu sandwich + salad"
      ]
    }
  }
};

export default function Suggestions() {
  const [diet, setDiet] = useState('veg');
  const [budget, setBudget] = useState('medium');
  const [goal, setGoal] = useState('Maintenance');

  const suggestions = MEAL_PLANS[diet][budget][goal];

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Meal Suggestions</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <select value={diet} onChange={(e) => setDiet(e.target.value)} className="border p-2 rounded">
          <option value="veg">Veg</option>
          <option value="nonveg">Non-Veg</option>
          <option value="vegan">Vegan</option>
        </select>

        <select value={budget} onChange={(e) => setBudget(e.target.value)} className="border p-2 rounded">
          <option value="low">Low Budget</option>
          <option value="medium">Medium Budget</option>
          <option value="high">High Budget</option>
        </select>

        <select value={goal} onChange={(e) => setGoal(e.target.value)} className="border p-2 rounded">
          <option value="Fat Loss">Fat Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      <ul className="space-y-2 list-disc list-inside">
        {suggestions.map((item, i) => (
          <li key={i} className="bg-white dark:bg-gray-800 border rounded p-3 shadow-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
