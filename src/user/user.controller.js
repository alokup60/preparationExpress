//it's also called  as router file

import express from "express";
import { User } from "./user.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
   
  const { name, email, password } = req.body;
  //   console.log(name, email, password);
   //todo: validate the data coming from the client

  const result = await User.create({ name, email, password });

  console.log(result);

  res.status(201).json({ id: result._id });
});

export default router;

//we will write all the user related routes here and then we will import this router in server.js and use it there
