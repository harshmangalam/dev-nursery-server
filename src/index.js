const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { createAdmin } = require("./seeds/user.seed");
require("dotenv").config();

const app = express();

const http = require("http").createServer(app);

// routes
const authRoutes = require("./routes/auth.route");
const collectionRoutes = require("./routes/collection.route");
const plantRoutes = require("./routes/plant.route");
const cartRoutes = require("./routes/cart.route");

// middlewares

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: JSON.parse(process.env.ORIGIN),
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());

// log in development environment

if (process.env.NODE_ENV === "developement") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// server health check

app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

// routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/cart", cartRoutes);

// page not found error handling  middleware

app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: "API endpoint does not exists",
  };
  next(error);
});

// global error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("database connected");
    await createAdmin();
    http.listen(process.env.PORT, () =>
      console.log(`Server listening on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
