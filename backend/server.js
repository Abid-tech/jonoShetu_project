const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// CORS (keep flexible version)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://abid_db_user:8LmlR59iZ3WRunzM@cluster0.aafcp16.mongodb.net/JonoShetu")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
const voteRoutes = require("./routes/voteRoutes");
app.use("/api/votes", voteRoutes);

app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/gov-links', require('./routes/govLinkRoutes'));

const registrationRoutes = require("./routes/registration");   
app.use("/register", registrationRoutes);                      

const loginRoute = require("./routes/login");
app.use("/login", loginRoute);

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));