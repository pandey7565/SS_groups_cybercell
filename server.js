const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== Static Files =====
app.use(express.static(path.join(__dirname, "public")));

// ===== Session Config =====
app.use(
  session({
    secret: "ssgroupscybercell",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000 // 5 minutes
    }
  })
);

// ===== LOGIN PAGE =====
app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/dashboard");
  }
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ===== LOGIN LOGIC =====
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    req.session.loggedIn = true;
    req.session.username = username;
    return res.redirect("/dashboard");
  }

  res.send(`
    <body style="background:black;color:red;font-family:monospace;text-align:center;margin-top:20%">
      <h2>❌ Invalid Credentials</h2>
      <a href="/" style="color:#1e90ff">Try Again</a>
    </body>
  `);
});

// ===== DASHBOARD (PROTECTED) =====
app.get("/dashboard", (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ===== LOGOUT =====
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

// ===== SERVER =====
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
