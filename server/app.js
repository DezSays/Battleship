/* Basic setup for a Node.js server using Express */

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "https://battleship-umber.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require("./routes"));

// Checks health
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// Test DB connection + sync models
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });
