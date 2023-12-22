const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const { User } = require("./models/User");
const bodyParser = require("body-parser");
const config = require("./config/key");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("Mongodb 연결");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("register");
});

app.post("/register", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

app.listen(port, () => {
  console.log(`${port} eshitayapti!!!`);
});
