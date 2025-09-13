// utils/socketAuth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifySocketToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      // console.log("decoded",decoded)
      resolve(decoded); // { id: userId, ... }
    });
  });
};
