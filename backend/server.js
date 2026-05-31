const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect("mongodb+srv://abid_db_user:8LmlR59iZ3WRunzM@cluster0.aafcp16.mongodb.net/JonoShetu")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//changed
app.use("/api/votes", require("./routes/voteRoutes"));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/gov-links', require('./routes/govLinkRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
const registrationRoutes = require("./routes/registration");   
app.use("/register", registrationRoutes);       
const loginRoute = require("./routes/login");
app.use("/login", loginRoute);

const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/analytics", analyticsRoutes);

const complaintRoutes = require("./routes/complaintRoutes");
app.use("/complaints", complaintRoutes);



// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    chatbotApi: '/api/chatbot/chat'
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Chatbot: http://localhost:${PORT}/api/chatbot/chat\n`);
});



