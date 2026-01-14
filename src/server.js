const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SUPER_SECRET_KEY";

/* ======================
   AUTH ROUTES
====================== */

// LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // TEMP USER (later from DB)
  if (email === "user@test.com" && password === "123456") {
    const token = jwt.sign(
      { role: "user", email },
      SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  // TEMP ADMIN
  if (email === "admin@test.com" && password === "admin123") {
    const token = jwt.sign(
      { role: "admin", email },
      SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// PROTECTED TEST
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

/* ======================
   JWT MIDDLEWARE
====================== */

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(403);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/* ======================
   SERVER START
====================== */

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
