import "dotenv/config";
import express from "express";
import cors from "cors";

import { ensureDatabaseReady } from "./lib/db.js";
import { readToken } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import tutorialRoutes from "./routes/tutorials.js";
import problemRoutes from "./routes/problems.js";
import categoryRoutes from "./routes/categories.js";
import searchRoutes from "./routes/search.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "256kb" }));
app.use(readToken);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) =>
  res.status(404).json({ error: "No route matches that URL." }),
);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(500)
    .json({ error: "Something broke on the server. Check the server log." });
});

const startServer = async () => {
  await ensureDatabaseReady();

  const port = process.env.PORT || 4001;
  app.listen(port, () =>
    console.log(`KeffaCode API on http://localhost:${port}`),
  );
};

startServer().catch((err) => {
  console.error("Server startup failed:", err);
  process.exit(1);
});
