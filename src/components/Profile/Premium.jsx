import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Premium = () => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan) => {
    setLoading(true);
    try {
      // Call backend API to create checkout session (Stripe, Razorpay, etc.)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to payment page
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      alert("⚠️ Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const plans = [
    {
      id: "monthly",
      title: "Monthly Plan",
      price: "₹499 / month",
      features: [
        "AI Meal Scanner",
        "Personalized Plans",
        "Advanced Stats & Charts",
        "Priority Support",
      ],
    },
    {
      id: "yearly",
      title: "Yearly Plan",
      price: "₹4,999 / year",
      features: [
        "All Premium Features",
        "2 Months Free",
        "Early Access to New Tools",
      ],
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">💎 Upgrade to Premium</h1>

      <p className="text-gray-600 mb-6">
        Unlock powerful AI tools, personalized coaching, and exclusive features
        to supercharge your fitness journey.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white shadow rounded-2xl p-6 flex flex-col"
          >
            <h2 className="text-lg font-semibold mb-2">{plan.title}</h2>
            <p className="text-xl font-bold text-purple-600 mb-4">
              {plan.price}
            </p>
            <ul className="mb-6 space-y-2 text-sm text-gray-600">
              {plan.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading}
              className="mt-auto bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
