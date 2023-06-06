var jwt = require("jsonwebtoken");
var uuid4 = require("uuid4");
require("dotenv").config();

var app_access_key = process.env.APP_ACCESS_KEY;
var app_secret = process.env.APP_SECRET;
console.log(app_access_key, app_secret);

var token = new Promise(function (resolve, reject) {
  var payload = {
    access_key: app_access_key,
    type: "management",
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
  };

  jwt.sign(
    payload,
    app_secret,
    {
      algorithm: "HS256",
      expiresIn: "24h",
      jwtid: uuid4(),
    },
    function (err, token) {
      console.log(token);
      console.log(err);
      resolve(token);
    }
  );
});

module.exports = token;
