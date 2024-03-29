const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const { resolve } = require("path");
const cors = require("cors");

const app = express();

//connect database
connectDB();

//init MiddleWare
app.use(
  cors({
    origin: "https://dev-connector-r0oy.onrender.com",
  })
); // Add CORS middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/post", require("./routes/api/post"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path, resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
