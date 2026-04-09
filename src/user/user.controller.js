//it's also called  as router file

import express from "express";
import { User } from "./user.model.js";

const router = express.Router();

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

  const result = await User.create({ name, email, password });

  console.log(result);

  res.status(201).json({ id: result._id });
});

export default router;

//we will write all the user related routes here and then we will import this router in server.js and use it there
