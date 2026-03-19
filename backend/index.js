const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const dayjs = require("dayjs");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Sync daily scores
app.post("/sync/daily-scores", async (req, res) => {
  const { userId, date, puzzleId, score, timeTaken } = req.body;

  // Security Rules
  const todayStr = dayjs().format("YYYY-MM-DD");
  if (dayjs(date).isAfter(dayjs())) {
    return res.status(400).json({ error: "Cannot sync future dates" });
  }

  if (score < 0 || score > 100) {
    return res.status(400).json({ error: "Invalid score range" });
  }

  if (timeTaken < 1) {
    return res.status(400).json({ error: "Unrealistic completion time" });
  }

  try {
    // Upsert user (Guest mode fallback)
    const user = await prisma.user.upsert({
      where: { email: `guest_${userId}@logiclooper.com` },
      update: {
        last_played: new Date(),
        total_points: { increment: score },
      },
      create: {
        id: userId,
        email: `guest_${userId}@logiclooper.com`,
        last_played: new Date(),
        total_points: score,
      },
    });

    // Save Daily Score
    const dailyScore = await prisma.dailyScore.upsert({
      where: { 
        user_id_date: {
          user_id: user.id,
          date: date
        } 
      },
      update: {
        score: score,
        time_taken: timeTaken,
        puzzle_id: puzzleId
      },
      create: {
        user_id: user.id,
        date: date,
        puzzle_id: puzzleId,
        score: score,
        time_taken: timeTaken
      }
    });

    // Update Streak (simplified logic)
    // In a real app, this would check consecutive days
    const allScores = await prisma.dailyScore.findMany({
        where: { user_id: user.id },
        orderBy: { date: 'desc' }
    });

    let streak = 0;
    let checkDate = dayjs(todayStr);
    for (const s of allScores) {
        if (s.date === checkDate.format("YYYY-MM-DD")) {
            streak++;
            checkDate = checkDate.subtract(1, 'day');
        } else {
            break;
        }
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { streak_count: streak }
    });

    res.json({ success: true, streak });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Internal server sync failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
