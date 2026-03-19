import { useState, useEffect } from "react";
import { usePuzzle } from "../hooks/usePuzzle";
import { motion, AnimatePresence } from "framer-motion";

export default function PuzzleArea({ onComplete }) {
  const { puzzle, loading } = usePuzzle();
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle");
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let interval;
    if (status === "idle" && !loading) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, loading]);

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!puzzle) return <div>No puzzle found.</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (puzzle.checkSolution(answer)) {
      setStatus("success");
      const baseScore = 100;
      const timePenalty = Math.floor(timer / 10);
      const hintPenalty = hintsUsed * 20;
      const finalScore = Math.max(20, baseScore - timePenalty - hintPenalty);

      onComplete({
        solved: true,
        score: finalScore,
        timeTaken: timer,
        hintsUsed: hintsUsed,
      });
    } else {
      setStatus("fail");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const useHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#14151a] p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 max-w-lg mx-auto my-8 relative overflow-hidden backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 p-4 font-mono text-sm text-gray-400 dark:text-gray-500">
        Time: {formatTime(timer)}
      </div>

      <div className="mb-8">
        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20">
          {puzzle.type.replace('_', ' ')}
        </span>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-4 mb-2 italic tracking-tight">
          {puzzle.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-500 text-sm font-medium">
          {puzzle.instruction}
        </p>
      </div>

      <div className="mb-8 p-8 bg-gray-50 dark:bg-black/40 rounded-3xl text-center font-mono text-3xl tracking-widest border border-gray-200 dark:border-white/5 shadow-inner">
        {puzzle.type === "SEQUENCE_SOLVER" && (
          <div className="flex justify-center gap-4">
            {puzzle.data.sequence.map((n, i) => (
              <motion.span 
                key={i} 
                className={n === "?" ? "text-blue-600 font-bold border-b-2 border-blue-600" : "text-gray-800 dark:text-gray-200"}
                animate={n === "?" ? { y: [0, -2, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {n}
              </motion.span>
            ))}
          </div>
        )}

        {puzzle.type === "NUMERIC_GRID" && (
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            {puzzle.data.grid.flat().map((n, i) => (
              <div key={i} className={`w-12 h-12 flex items-center justify-center rounded-lg border ${n === '?' ? 'bg-blue-500/10 border-blue-500 text-blue-600 font-bold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}`}>
                {n}
              </div>
            ))}
          </div>
        )}

        {puzzle.type === "BINARY_LOGIC" && (
          <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
             {puzzle.data.expression}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ENTER SOLUTION"
          className="w-full px-8 py-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-2xl font-black text-center placeholder-gray-300 dark:placeholder-gray-700 tracking-[0.2em] shadow-inner"
          disabled={status === "success"}
          autoFocus
        />
        
        <div className="flex gap-4">
            <button
            type="submit"
            className={`flex-1 py-4 rounded-xl font-black text-lg transition-all active:scale-95 shadow-lg ${
                status === "success" 
                ? "bg-green-500 text-white shadow-green-500/20" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
            }`}
            disabled={status === "success"}
            >
            {status === "success" ? "✓ CHALLENGE COMPLETE" : "SUBMIT"}
            </button>

            {status !== "success" && (
                <button
                    type="button"
                    onClick={useHint}
                    className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Feeling stuck?"
                >
                    💡
                </button>
            )}
        </div>

        <AnimatePresence>
            {showHint && (
                <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-amber-500 text-sm font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50"
                >
                    💡 Hint: {puzzle.hint}
                </motion.p>
            )}

            {status === "fail" && (
            <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm text-center font-bold"
            >
                ❌ Incorrect! Try thinking outside the box.
            </motion.p>
            )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
