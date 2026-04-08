import express from "express";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

//routes
app.get("/", (req, res) => {
  res.send("This is home page");
  //   res.json({ message: "This is home page" });
});

app.get("/healthy", (req, res) => {
  console.log(req.query);
  res.send("This is healthy page");
});

app.post("/api/users", (req, res) => {
  console.log(req.body); //return undefrined because we have not used any middleware to parse the body of the request
  res.json({}); //end the rsponse and send the data to client
});

app.listen(5500, () => {
  console.log("Server is running on port 5500");
});
