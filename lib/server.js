require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const { error } = require("../core/util/response");
const verifyjwt = require("./middleware/verifyjwt");

const connectDb = require("../core/config/dbConn");

const authRoute = require("../core/routes/auth.route");
const storeRoute = require("../core/routes/store.route");
const userRoute = require("../core/routes/user.route");

// Connection mongo database
connectDb();

// Creating app instance
const app = express();
const PORT = process.env.PORT || 5050;

// Configuring basic middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../public/")));

// Routes

app.get("/", (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.use("/auth", authRoute);
app.use("/stores", storeRoute);
app.use("/user", verifyjwt, userRoute);

// Managing all other routes
app.all("*", (req, res) => {
  console.log(`url - ${req.url}`);
  res.status(402).sendFile(path.resolve(__dirname, `../public/error.html`));
});

// Start server only db is once connnected
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is up in ${PORT}`);
  });
});
