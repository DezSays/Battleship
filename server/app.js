/* Basic setup for a Node.js server using Express */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const allowed_origins = [
  "https://battleship-umber.vercel.app",
  "http://localhost:3000",
];

const cors_options = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowed_origins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(cors_options));
app.options("*", cors(cors_options));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.use(require("./routes"));

if (require.main === module) {
  // Lazy-load DB only for local server startup
  const db = require("./models");

  db.sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Database connected.");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to database:", err);
      process.exit(1);
    });
}

module.exports = app;
