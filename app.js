const path = require("path");
const express = require("express");

const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const tourRouter = require("./starter/routes/tourRoutes");
const userRouter = require("./starter/routes/userRoutes");
const reviewRouter = require("./starter/routes/reviewRoutes");
const viewRouter = require("./starter/routes/viewRoutes");
const globalErrorHandler = require("./starter/controllers/errorController");
const AppError = require("./starter/utils/appError");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "starter", "views"));
// 1) GLOBAL Middleware

// Set Security HTTP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://another-cdn.com", // Any other CDNs you're using
      ],
      styleSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com",
      ],
      imgSrc: [
        "'self'",
        "*.openstreetmap.org",
        "data:",
        "https://example-image-source.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.example.com",
        "ws://localhost:*", // Allow WebSocket from localhost (for Parcel HMR)
        "ws://127.0.0.1:*", // Allow WebSocket from 127.0.0.1 (any port for Parcel HMR)
        "ws://0.0.0.0:*", // Sometimes Parcel might use 0.0.0.0 for WebSocket connections
      ],
    },
  })
);

// Development Log in
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMillisec: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please come back after an hour.",
});

app.use("/api", limiter);

// Body Parser, Reading data from the body into req.body
app.use(express.json({ limit: "10kb" })); //middleware
app.use(cookieParser());

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());
// Data sanitization against XSS (cross site scripting)
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Serving Static Files
app.use(express.static(`${__dirname}/starter/public`));

// Test Middleware (not relevant)
app.use((req, res, next) => {
  next();
});

// 3) Routes

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
