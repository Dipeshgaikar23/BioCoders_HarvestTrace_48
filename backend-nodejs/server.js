const PORT = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");


const farmerRoutes = require("./routes/Farmer.Routes");
const consumerRoutes = require("./routes/Consumer.Routes");



// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // ✅ Parses form data
app.use(cors()); // Handle Cross-Origin requests

// Routes
app.use("/farmers", farmerRoutes); // Use Farmer Routes
app.use("/consumer", consumerRoutes); // Use Consumer Routes


// Connect to Database
connectDB();

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Natural Farming API!");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
