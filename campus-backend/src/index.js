const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("Database environment variables loaded:", 
    !!process.env.DB_HOST && 
    !!process.env.DB_USER && 
    !!process.env.DB_PASSWORD
);

const app = express();

app.use(cors());
app.use(express.json());

// Routes (adjusted paths to match your src/routes folder structure)
const authRoutes = require("./routes/auth");
const committeeRoutes = require("./routes/committees");
const eventRoutes = require("./routes/events");
const lostFoundRoutes = require("./routes/lostFound"); // This handles lost, found, and claims

app.use("/api/auth", authRoutes);
app.use("/api/committees", committeeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/items", lostFoundRoutes); // Unified prefix to cover /lost, /found, and /claims inside lostItems.js

app.get("/", (req, res) => {
    res.json({
        message: "Campus Backend is running!"
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const pool = require("./config/db");

pool.query("SELECT NOW()")
    .then(result => {
        console.log("Database connected!");
        console.log(result.rows[0]);
    })
    .catch(error => {
        console.error("Database connection failed:");
        console.error(error.message);
    });