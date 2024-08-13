const express = require("express"),
jwt = require("jsonwebtoken"),
app = express(),
port = 3000,
secretKey = "zendesk_secret", // zendesk 
kid='kid_zendesk';

app.use(express.json());

app.post("/login", (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const payload = {  
      "external_id": "A4ashTYAJ123",
      "email": "testandrestest40@playtech.com",
      "name": "Andres Yanquen",
      "scope": "user"
    }
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (username === "admin" && password === "123") {
      const token = jwt.sign(payload, secretKey, { header: { kid } });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" + error });
  }
});

function verifyToken(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }
  try {
    const payload = jwt.verify(token, secretKey);
    req.username = payload.username;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}

app.get("/protected", verifyToken, (req, res) => {
  return res.status(200).json({ message: "You have access" });
});

app.listen(port, () => {
  console.log(`Server listen on http://localhost:${port}`);
});