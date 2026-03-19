import HeatmapCell from "./HeatmapCell";

export default function HeatmapGrid({ days, activityMap }) {
  function getLevel(day) {
    const key = day.format("YYYY-MM-DD");
    const data = activityMap[key];

    if (!data) return 0;
    if (data.score > 90) return 4;
    if (data.score > 70) return 3;
    if (data.score > 40) return 2;
    return 1;
  }

  return (
    <div className="flex gap-1 overflow-x-auto p-2">
      {/* Group days into weeks (columns) */}
      {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {days.slice(weekIndex * 7, (weekIndex * 7) + 7).map((day, dayIndex) => (
            <HeatmapCell
              key={dayIndex}
              date={day.format("YYYY-MM-DD")}
              level={getLevel(day)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}