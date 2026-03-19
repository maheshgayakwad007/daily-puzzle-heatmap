import { useEffect, useState } from "react";
import dayjs from "dayjs";
import HeatmapGrid from "./HeatmapGrid";
import PuzzleArea from "./PuzzleArea";
import { getAllActivity, saveActivity, attemptSync } from "../db";
import { motion } from "framer-motion";

export default function HeatmapContainer() {
  const [days, setDays] = useState([]);
  const [activityMap, setActivityMap] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    generateDays();
    loadData();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleOnline = () => {
    setIsOnline(true);
    attemptSync().then(loadData);
  };
  const handleOffline = () => setIsOnline(false);

  function generateDays() {
    const startOfYear = dayjs().startOf("year");
    const endOfYear = dayjs().endOf("year");
    const temp = [];
    let current = startOfYear;
    while(current.isBefore(endOfYear) || current.isSame(endOfYear, 'day')) {
        temp.push(current);
        current = current.add(1, 'day');
    }
    setDays(temp);
  }

  async function loadData() {
    const data = await getAllActivity();
    const map = {};
    data.forEach((item) => {
      map[item.date] = item;
    });
    setActivityMap(map);
  }

  async function handlePuzzleComplete(result) {
    const today = dayjs().format("YYYY-MM-DD");
    await saveActivity({
      date: today,
      ...result
    });
    await loadData();
  }

  function calculateStreak() {
    let streak = 0;
    let checkDate = dayjs();
    while (activityMap[checkDate.format("YYYY-MM-DD")]?.solved) {
      streak++;
      checkDate = checkDate.subtract(1, "day");
    }
    return streak;
  }

  return (
    <div className="selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-16">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent italic">
              LOGIC LOOPER
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${isOnline ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-red-500/50 text-red-500 bg-red-500/10'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isOnline ? 'SYNC LIVE' : 'OFFLINE MODE'}
            </div>
          </div>
        </div>

        {/* Puzzle Section */}
        <PuzzleArea onComplete={handlePuzzleComplete} />

        {/* Achievement Dashboard */}
        <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#14151a] p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 mt-16 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
            <div>
              <h2 className="text-3xl font-black mb-3 italic tracking-tight text-gray-900 dark:text-white">PROGRESS TRACKER</h2>
              <p className="text-gray-500 font-medium">Visualization of your logic mastery over {days.length} days.</p>
            </div>
            
            <div className="flex gap-8">
                <div className="text-center">
                    <div className="text-4xl font-black text-blue-500">{Object.keys(activityMap).length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mt-1">Total Solved</div>
                </div>
                <div className="text-center px-8 border-x border-gray-100 dark:border-white/5">
                    <div className="text-4xl font-black text-orange-500 animate-pulse">🔥 {calculateStreak()}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mt-1">Current Streak</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-black text-purple-500">
                        {Math.floor(Object.values(activityMap).reduce((acc, curr) => acc + (curr.score || 0), 0))}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mt-1">Rank Points</div>
                </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-3xl border border-gray-100 dark:border-white/5 overflow-x-auto">
            <HeatmapGrid days={days} activityMap={activityMap} />
            
            <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500/10 dark:bg-red-500/20 rounded-full border border-red-500/20"></div>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Missed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tighter">Current Day</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase">Intensity</span>
                    <div className="flex gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-sm bg-gray-200 dark:bg-gray-700/50"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-green-100 dark:bg-green-900/30"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-green-300 dark:bg-green-700/50"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-green-500 dark:bg-green-500/70"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-green-600 dark:bg-green-400/90 shadow-[0_0_8px_rgba(74,222,128,0.4)]"></div>
                    </div>
                </div>
            </div>
          </div>
        </motion.div>

        {/* Brand Footer */}
        <div className="mt-20 text-center opacity-20 hover:opacity-100 transition-opacity">
            <p className="text-xs font-mono letter-spacing-widest">ENCRYPTED CLIENT-SIDE LOGIC SYSTEM v1.0.4 - NO SERVER DEPENDENCY REQUIRED</p>
        </div>
      </div>
    </div>
  );
}