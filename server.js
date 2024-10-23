const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 3000;

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Ensures MongoDB driver is used with best handling of connections
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

// 4) Starting Server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection! Shutting down....");
  server.close(() => {
    process.exit(1); //ends the program abruptly
  });
});
