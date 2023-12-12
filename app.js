const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const path = require("path");
const { handleFileUpload } = require("./upload/signUpload");
const multer = require("multer");
const cors = require("cors");

//midleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public/"));
app.set("views", path.join(__dirname, "views"));
app.use(cors());

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

///////storege
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure Multer to use the memory storage !!!
app.use(upload.fields([{ name: "profilePicture" }, { name: "pdfFile" }]));

app.post("/signup", handleFileUpload);

//routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.use(authRoutes);

module.exports = app;
