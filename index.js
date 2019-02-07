const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
//mongoDB configuration
const db = require("./setup/myurl").mongoURL;
const app = express();

//Attempt to connect to database

mongoose
  .connect(db)
  .then(() => console.log("Mongodb connected succesfully"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Config for Jwt stratergy
require("./stratregies/jsonawtStrategies")(passport);

//Bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");

//Middleware for bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//actual routes
//move ur route to seperate file
//calling
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/question", question);

//just  for checking
app.get("/", (req, res) => {
  res.send("Hey there big stack");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
