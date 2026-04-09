import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import userController from "./src/user/user.controller.js";

const app = express();
dotenv.config();

try {
  await connectDB();
  console.log("MongoDB connected sucessfully !");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

app.use(cors()); // Enable CORS for all routes (third party middleware)
//Middleware
//1. Gloabal middleware
app.use(express.json()); // Middleware to parse JSON bodies

//2.Custom middleware
const reqLoggers = (req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date()}`);
  next(); // Call the next middleware or route handler
};

// app.use(reqLoggers); // Use the custom middleware for all routes

//routes
app.get("/", (req, res) => {
  res.send("This is home page");
  //   res.json({ message: "This is home page" });
});

//register routes from user.controller.js
app.use("/api/users", userController);

app.get("/healthy", (req, res) => {
  console.log(req.query);
  res.send("This is healthy page");
});

//use reqLoggers middleware only for this route
// app.post("/api/users", reqLoggers, (req, res) => {
//   //   console.log(req.body); //return undefrined because we have not used any middleware to parse the body of the request

//   throw new Error("This is an error"); // This will be caught by the error handling middleware

//   res.json({}); //end the rsponse and send the data to client
// });

//error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   //   res.status(500).send("Something went wrong!");
//   res.status(500).json({ message: "Something went wrong!" });
// });
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .json({ message: err.message || "Something went wrong!" });
});

app.listen(5500, () => {
  console.log("Server is running on port 5500");
});
