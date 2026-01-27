/* Basic setup for a Node.js server using Express */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["https://battleship-umber.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require("./routes"));

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

db.sequelize
  .sync({ force: false })
  .then(() => console.log("Database connected."))
  .catch((err) => console.error("Failed to connect to database:", err));

module.exports = app;
