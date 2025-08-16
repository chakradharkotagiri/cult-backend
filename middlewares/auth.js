const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token. Authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user payload to request
    console.log("🧠 user from token:", req.user);

    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid." });
  }
};

module.exports = auth;
