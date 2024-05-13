const verifyToken = require("../utils/verifyToken");

const authMiddleware = (req, res, next) => {
  const auth = req?.headers?.authorization || " ";
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(403).json({ message: "Headers are not there" });
    return;
  }
  const token = auth.split(" ")[1];

  try {
    const decodedToken = verifyToken(token);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized user",
      error: error,
    });
  }
};

module.exports = authMiddleware;
