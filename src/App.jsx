import { useState, useEffect } from "react";
import HeatmapContainer from "./components/HeatmapContainer";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || !("theme" in localStorage);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#0a0a0c] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-6 pt-6 flex justify-end">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-full font-bold text-xs border transition-all ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
        >
          {darkMode ? '🌙 DARK MODE' : '☀️ DAY MODE'}
        </button>
      </div>
      <HeatmapContainer />
    </div>
  );
}

export default App;