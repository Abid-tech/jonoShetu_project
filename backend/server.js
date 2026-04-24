const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://abid_db_user:8LmlR59iZ3WRunzM@cluster0.aafcp16.mongodb.net/JonoShetu")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.use("/api/votes", require("./routes/voteRoutes"));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/gov-links', require('./routes/govLinkRoutes'));
const registrationRoutes = require("./routes/registration");   
app.use("/register", registrationRoutes);       
const loginRoute = require("./routes/login");
app.use("/login", loginRoute);

const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/analytics", analyticsRoutes);

const complaintRoutes = require("./routes/complaintRoutes");
app.use("/complaints", complaintRoutes);



app.listen(5000, () => console.log("Server running on port 5000"));


