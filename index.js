const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const { User } = require("./models/User");
const bodyParser = require("body-parser");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post("/login", (req, res) => {
  // 요청된 이메일 데이터 베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.emal }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
  });
  // 요청된 이메일 데이터 베이스에 있다면 비밀번호가 맞는지 확인
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (!isMatch)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
  });

  // 비밀번호 까지 맞다면 토근을 생성하기.

  user.generateToken((err, user) => {
    if (err) return res.status(400).send(err);

    // token을 저장한다. 어디? 쿠키, localstorege
  });
  res
    .cookie("x_auth", user.token)
    .status(200)
    .json({ loginSuccess: false, userId: user._id });
});

app.listen(port, () => {
  console.log(`${port} eshitayapti!!!`);
});
