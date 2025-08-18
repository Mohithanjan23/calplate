import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Recipes = () => {
  const { user } = useContext(AppContext);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);

    const query = supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (search.trim()) {
      query.ilike("title", `%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data) setRecipes(data);
    setLoading(false);
  };

  const saveRecipe = async (recipe) => {
    if (!user) return;
    const { error } = await supabase.from("saved_recipes").insert([
      { user_id: user.id, recipe_id: recipe.id },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to save recipe.");
    } else {
      alert("✅ Recipe saved!");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading && !recipes.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">👨‍🍳 Healthy Recipes</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={fetchRecipes}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
        >
          Search
        </button>
      </div>

      {/* Recipe List */}
      {!recipes.length ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg mb-2">{r.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{r.description}</p>
                <p className="text-xs text-gray-500 mb-2">
                  Calories: {r.calories} | Protein: {r.protein}g | Carbs: {r.carbs}g | Fat: {r.fat}g
                </p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => saveRecipe(r)}
                  className="text-blue-500 text-sm"
                >
                  Save
                </button>
                {r.link && (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 text-sm"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
