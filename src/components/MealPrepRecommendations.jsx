export default function MealPrepRecommendations({ onClose }) {
    // Sample data, can be fetched from an API in the future
    const recommendations = [
        { title: "Quick & Easy Meals", description: "15-30 min recipes", color: "from-blue-50 to-blue-100" },
        { title: "Batch Cooking", description: "Weekend prep ideas", color: "from-purple-50 to-purple-100" },
        { title: "Healthy Options", description: "Nutrient-dense meals", color: "from-green-50 to-green-100" },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Meal Prep Ideas</h2>
                    <button onClick={onClose} className="font-bold text-2xl">&times;</button>
                </div>
                <div className="space-y-3">
                    {recommendations.map(rec => (
                        <div key={rec.title} className={`p-4 rounded-lg bg-gradient-to-r ${rec.color}`}>
                            <p className="font-semibold">{rec.title}</p>
                            <p className="text-sm">{rec.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}