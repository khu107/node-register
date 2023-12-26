const { User } = require("../models/User");

let auth = (req, res, next) => {
  // client 쿠키에서 토근을 가져온다.
  let token = req.coolies.x_auth;

  // 토근을 복호화 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    next();
  });

  // 유저가 있으면 인증 오케

  // 유저가 없으면 인증 no
};

module.exports = { auth };
