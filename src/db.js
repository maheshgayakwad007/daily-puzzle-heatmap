import { openDB } from "idb";

export const dbPromise = openDB("heatmap-db", 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      db.createObjectStore("dailyActivity", { keyPath: "date" });
    }
    if (oldVersion < 2) {
      // Add a store for offline sync requests
      db.createObjectStore("syncQueue", { keyPath: "date" });
    }
  },
});

// Save activity locally + enqueue for sync
export async function saveActivity(data) {
  const db = await dbPromise;
  const entry = { ...data, synced: false };
  await db.put("dailyActivity", entry);
  await db.put("syncQueue", entry);
  
  // Attempt immediate sync
  await attemptSync();
}

export async function attemptSync() {
  if (!navigator.onLine) return;
  
  const db = await dbPromise;
  const syncQueue = await db.getAll("syncQueue");
  
  for (const entry of syncQueue) {
    try {
      const response = await fetch("http://localhost:3001/sync/daily-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "GUEST_123", // For demo: hardcoded guest ID
          date: entry.date,
          puzzleId: "PZ_" + entry.date,
          score: entry.score,
          timeTaken: entry.timeTaken
        }),
      });
      
      if (response.ok) {
        await db.delete("syncQueue", entry.date);
        await db.put("dailyActivity", { ...entry, synced: true });
        console.log("Successfully synced:", entry.date);
      }
    } catch (e) {
      console.error("Sync failed for:", entry.date, e);
    }
  }
}

// Get all activity
export async function getAllActivity() {
  const db = await dbPromise;
  return await db.getAll("dailyActivity");
}