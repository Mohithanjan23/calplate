// src/components/MealCard.jsx
import Card from './Card'; // Use our glassmorphic card

const MealCard = ({ meal }) => {
  if (!meal) return null;

  return (
    <Card className="!p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{meal.food_name}</p>
        <div className="flex gap-4 text-xs text-text-secondary mt-1">
          <span>P: {meal.protein_g || 0}g</span>
          <span>C: {meal.carbs_g || 0}g</span>
          <span>F: {meal.fat_g || 0}g</span>
        </div>
      </div>
      <p className="font-bold text-lg">{meal.calories} <span className="text-sm font-normal text-text-secondary">kcal</span></p>
    </Card>
  );
};

export default MealCard;