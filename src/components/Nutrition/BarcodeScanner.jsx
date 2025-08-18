import React, { useState, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

// We’ll use the "html5-qrcode" library for barcode scanning
// Install: npm install html5-qrcode
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScanner = () => {
  const { user } = useContext(AppContext);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startScanner = () => {
    setScanning(true);
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        html5QrCode.stop();
        setScanning(false);
        handleBarcode(decodedText);
      },
      (errorMessage) => {
        console.log("Scanning error:", errorMessage);
      }
    );
  };

  const handleBarcode = async (code) => {
    setLoading(true);

    // Check if barcode already exists in DB
    const { data, error } = await supabase
      .from("barcode_foods")
      .select("*")
      .eq("barcode", code)
      .single();

    if (error || !data) {
      alert("⚠️ Food not found in database. Please add manually.");
      setResult(null);
    } else {
      setResult(data);

      // Optionally, auto-log as meal
      if (user) {
        await supabase.from("meals").insert([
          {
            user_id: user.id,
            name: data.name,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
          },
        ]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">📷 Barcode Scanner</h1>

      {!scanning ? (
        <button
          onClick={startScanner}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Start Scanning
        </button>
      ) : (
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Point your camera at a barcode...</p>
          <div id="reader" className="w-full h-64 border rounded-lg"></div>
        </div>
      )}

      {loading && <Loader />}

      {result && (
        <div className="mt-6 bg-white shadow rounded-xl p-4">
          <h2 className="font-semibold text-lg mb-2">{result.name}</h2>
          <p className="text-sm text-gray-600 mb-2">{result.brand || "Unknown brand"}</p>
          <p className="text-xs text-gray-500 mb-2">
            Calories: {result.calories} | Protein: {result.protein}g | Carbs: {result.carbs}g | Fat: {result.fat}g
          </p>
          <p className="text-xs text-gray-400">Barcode: {result.barcode}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
