/* Basic setup for a Node.js server using Express */

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3001;

/* ---- CORS CONFIG ---- */
const allowedOrigins = [
  "https://battleship-8nff.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

/* ---- BODY PARSERS ---- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---- ROUTES ---- */
app.use(require("./routes"));

/* ---- DB CONNECT + SERVER START ---- */
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
  });
