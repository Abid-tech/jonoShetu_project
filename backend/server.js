const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://abid_db_user:8LmlR59iZ3WRunzM@cluster0.aafcp16.mongodb.net/JonoShetu")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const voteRoutes = require("./routes/voteRoutes");
app.use("/api/votes", voteRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
