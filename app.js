const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

//midleware

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

//database connection

mongoose
  .connect(`${process.env.URL}`)
  .then(() => console.log("DB connected"))
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`SERVER START ON PORT ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to the database:", err));

//routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.use(authRoutes);
