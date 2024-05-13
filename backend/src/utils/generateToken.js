const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const getJwtToken = (id) => {
  user = JSON.stringify(id);
  const token = jwt.sign({ userId: id }, secretKey);
  return token;
};

module.exports = getJwtToken;
