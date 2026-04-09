//it's also called  as router file

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

//dynamic route handler for users
router.get("/:userId", auth, async (req, res, next) => {
  const requestUserId = req.params.userId; // Get the user ID from the route parameter
  const tokenUserId = req.userId; // Get the user ID from the authenticated token (set by the auth middleware)

  if (requestUserId !== tokenUserId) {
    const error = new Error("You are not authorized to access this user");
    error.statusCode = 403; // Forbidden
    next(error);
    return;
  }

  const user = await User.findOne({ _id: requestUserId }, { password: false }); //exclude password field from the result

  res.json(user);
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  //todo: validate the data coming from the client (using express validator or zod schema or joi schema)
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // Unauthorized
    next(error);
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // Unauthorized
    next(error);
    return;
  }

  //json web token (JWT) can be used here to generate a token and send it to the client for authentication in subsequent requests(todo)
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  }); // Generate a JWT token with user ID as payload and secret key from environment variables, set to expire in 1 hour

  // If we reach here, the user is authenticated
  res.json({ message: "Login successful", token });
});

router.post("/", async (req, res, next) => {
  const { name, email, password } = req.body;
  //   console.log(name, email, password);
  //todo: validate the data coming from the client (using express validator or zod schema or joi schema)
  if (!name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    next(error);
    return;
    // return res.status(400).json({message: "All fields are required"});
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = 409; // Conflict
    next(error);
    return;
  }

  try {
    const salt = bcrypt.genSaltSync(10); // Generate a salt with 10 rounds doesn't return same salt every time
    const hash = bcrypt.hashSync(password, salt);

    const result = await User.create({ name, email, password: hash });

    res
      .status(201)
      .json({ id: result._id, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
});

//todo: add multer for file upload and add route for profile picture upload

export default router;

//we will write all the user related routes here and then we will import this router in server.js and use it there
