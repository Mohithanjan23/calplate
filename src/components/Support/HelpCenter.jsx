import React, { useState } from "react";

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I log my meals?",
      a: "Go to the Nutrition section → 'Log Meal' and fill in the details of your food. You can also use the AI Meal Scanner.",
    },
    {
      q: "Can I track my workouts?",
      a: "Yes! Head to the Fitness section → 'Log Workout' and add your exercise details including duration and calories burned.",
    },
    {
      q: "How do I upgrade to Premium?",
      a: "Go to Profile → Premium to see available plans and subscribe securely using our payment system.",
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. All your data is stored securely with Supabase and only accessible to you.",
    },
  ];

  const contact = {
    email: "support@calplate.app",
    phone: "+91 98765 43210",
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">❓ Help Center</h1>

      {/* FAQ Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">📌 Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-xl p-4 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <p className="font-semibold">{item.q}</p>
              {openIndex === idx && (
                <p className="text-sm text-gray-600 mt-2">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">📞 Contact Support</h2>
        <p className="text-gray-600 mb-2">For further help, reach out to us:</p>
        <p className="text-sm">📧 Email: <a href={`mailto:${contact.email}`} className="text-blue-500">{contact.email}</a></p>
        <p className="text-sm">📱 Phone: <a href={`tel:${contact.phone}`} className="text-blue-500">{contact.phone}</a></p>
      </div>
    </div>
  );
};

export default HelpCenter;
