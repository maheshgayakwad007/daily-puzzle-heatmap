import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function HeatmapCell({ level, date }) {
  const isToday = date === dayjs().format("YYYY-MM-DD");
  
  const intensityMap = {
    0: "bg-gray-200 dark:bg-gray-700/50",
    1: "bg-green-200 dark:bg-green-900/30",
    2: "bg-green-400 dark:bg-green-700/50",
    3: "bg-green-600 dark:bg-green-500/70",
    4: "bg-green-800 dark:bg-green-400/90",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.2, zIndex: 10 }}
      title={`${date}: Level ${level}`}
      className={`w-3.5 h-3.5 rounded-sm transition-colors cursor-pointer ${intensityMap[level]} ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' : ''}`}
    ></motion.div>
  );
}