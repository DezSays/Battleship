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
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl/postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow known front-end origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Do NOT throw (prevents confusing 500 + "CORS header missing")
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require("./routes"));

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Only start listening when this file is run directly: `node app.js` / `npm start`
if (require.main === module) {
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
