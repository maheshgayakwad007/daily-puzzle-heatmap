import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { generateDailyPuzzle } from "../logic/puzzleEngine";

export function usePuzzle() {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    const p = generateDailyPuzzle(todayStr);
    setPuzzle(p);
    setLoading(false);
  }, []);

  return { puzzle, loading };
}
