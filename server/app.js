/* This is a basic setup for a Node.js server using the Express framework. */

const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(require("./routes"));
app.options("*", cors());

// Test DB connection + sync models
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to database:", err);
});
