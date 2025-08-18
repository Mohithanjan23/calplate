import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const ShoppingList = () => {
  const { user } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("shopping_list")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user || !newItem.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("shopping_list").insert([
      { user_id: user.id, name: newItem, checked: false },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to add item.");
    } else {
      setNewItem("");
      fetchItems();
    }
    setLoading(false);
  };

  const toggleItem = async (id, checked) => {
    const { error } = await supabase
      .from("shopping_list")
      .update({ checked: !checked })
      .eq("id", id);

    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, checked: !checked } : i))
      );
    }
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from("shopping_list").delete().eq("id", id);
    if (!error) setItems(items.filter((i) => i.id !== id));
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  if (loading && !items.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🛒 Shopping List</h1>

      {/* Add Item */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add grocery item..."
          className="flex-1 p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* Items List */}
      {!items.length ? (
        <p className="text-gray-500">Your shopping list is empty.</p>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div
              key={i.id}
              className="bg-white shadow rounded-xl p-3 flex justify-between items-center"
            >
              <div
                onClick={() => toggleItem(i.id, i.checked)}
                className={`flex-1 cursor-pointer ${
                  i.checked ? "line-through text-gray-400" : ""
                }`}
              >
                {i.name}
              </div>
              <button
                onClick={() => deleteItem(i.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
