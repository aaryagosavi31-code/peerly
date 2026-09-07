const express = require("express");
const pool = require("../config/db");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// GET ALL EVENTS
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM events ORDER BY start_time ASC");
        res.json({ events: result.rows });
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET SINGLE EVENT BY ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ event: result.rows[0] });
    } catch (error) {
        console.error("Get event error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// CREATE EVENT (Protected)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { committee_id, title, category, start_time, end_time, location, description, reg_link, poster_url, is_recruiting } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "Event title is required" });
        }

        const result = await pool.query(
            `INSERT INTO events (committee_id, title, category, start_time, end_time, location, description, reg_link, poster_url, is_recruiting) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                committee_id || null, 
                title, 
                category || null, 
                start_time || null, 
                end_time || null, 
                location || null, 
                description || null, 
                reg_link || null, 
                poster_url || null, 
                is_recruiting ?? false
            ]
        );

        res.status(201).json({
            message: "Event created successfully",
            event: result.rows[0],
        });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;