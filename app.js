const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// Import Routes
const categoryRoute = require("./app/Category/categoryRoute");
const authRoute = require("./app/Auth/route");
const tagsRoute = require("./app/Tags/tagsRoute");
const productRoute = require("./app/Product/productRoute");
const productClassicRoute = require("./app/productClassic/productClassicRoute");
const productFutureRoute = require("./app/productFuture/productFutureRoute");
const categoryWomenRoute = require("./app/CategoryWomen/categoryRoute");
const productsWomen = require("./app/ProductWomen/productRoute");
const sizedWomenRoute = require("./app/size/sizeRoute");
const orderRouter = require("./app/orderItems/orderRoute");
const paymentRoute = require("./app/Payment/payRouter");
const app = express();

// Definisikan corsOptions
const corsOptions = {
  origin: "http://localhost:5173", // Ganti dengan domain frontend Anda
  methods: ["GET", "POST", "PUT", "DELETE"], // Metode HTTP yang diizinkan
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
};

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Log Requests (optional, useful for debugging)
app.use(logger("dev"));

// Body Parser untuk meng-handle JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Parser (untuk menangani cookies jika diperlukan)
app.use(cookieParser());

// Static File Middleware (jika ada file statis yang harus disajikan)
app.use(express.static(path.join(__dirname, "public")));

// Gunakan CORS dengan corsOptions
app.use(cors(corsOptions));

//Guna Rites dengan Base URL /women
app.use("/v2", categoryWomenRoute);
app.use("/v2", sizedWomenRoute);
app.use("/v2", productsWomen);

// Gunakan Routes dengan Base URL /v1
app.use("/v1", categoryRoute);
app.use("/v1", productRoute);
app.use("/v1", tagsRoute);
//Gunakan untuk produck calsic dan future
app.use("/v1/product", productClassicRoute);
app.use("/v1/product", productFutureRoute);
// Route Auth untuk Login, Register, dll
app.use("/auth", authRoute);

//Route Order dan pembayaran
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRoute); // Prefiks "/api/payments"
// Menangani preflight request (OPTIONS) untuk semua route
app.options("*", cors(corsOptions)); // Menangani preflight untuk semua route

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

// Export app untuk digunakan di server
module.exports = app;
