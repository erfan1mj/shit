const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تابع لاگ اصلاح‌شده
function logData(data) {
  console.log("LOG:", data); // فقط به لاگ‌ها بفرست
}

// روت اصلی
app.get("/", (req, res) => {
  logData(`New visitor - IP: ${req.ip}, UA: ${req.headers["user-agent"]}`);
  res.send("Hello from Vercel! Logs are in the console 🚀");
});

// اگه فرم یا ریکوئست POST داری
app.post("/collect", (req, res) => {
  logData(`POST data: ${JSON.stringify(req.body)}`);
  res.json({ status: "ok" });
});

// سرور
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
