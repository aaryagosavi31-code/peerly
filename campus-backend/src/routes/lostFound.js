const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// =========================
// LOST ITEMS
// =========================

// GET all lost items
router.get("/lost", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM lost_items ORDER BY created_at DESC");
        res.json({ lost_items: result.rows });
    } catch (error) {
        console.error("Get lost items error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET lost item by ID
router.get("/lost/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM lost_items WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Lost item not found" });
        }

        res.json({ lost_item: result.rows[0] });
    } catch (error) {
        console.error("Get lost item error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST lost item (Protected)
router.post("/lost", authMiddleware, async (req, res) => {
    try {
        const { title, description, category, location_lost, date_lost, image_urls, status } = req.body;

        if (!title || !location_lost) {
            return res.status(400).json({ message: "Title and location are required" });
        }

        const result = await pool.query(
            `INSERT INTO lost_items (reporter_id, title, description, category, location_lost, date_lost, image_urls, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                req.user.id,
                title,
                description || null,
                category || null,
                location_lost,
                date_lost || null,
                image_urls || null,
                status || "lost"
            ]
        );

        res.status(201).json({
            message: "Lost item reported successfully",
            lost_item: result.rows[0],
        });
    } catch (error) {
        console.error("Create lost item error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// =========================
// FOUND ITEMS
// =========================

// GET all found items
router.get("/found", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM found_items ORDER BY created_at DESC");
        res.json({ found_items: result.rows });
    } catch (error) {
        console.error("Get found items error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET found item by ID
router.get("/found/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM found_items WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Found item not found" });
        }

        res.json({ found_item: result.rows[0] });
    } catch (error) {
        console.error("Get found item error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST found item (Protected)
router.post("/found", authMiddleware, async (req, res) => {
    try {
        const { title, description, category, location_found, date_found, image_urls, status } = req.body;

        if (!title || !location_found) {
            return res.status(400).json({ message: "Title and location are required" });
        }

        const result = await pool.query(
            `INSERT INTO found_items (reporter_id, title, description, category, location_found, date_found, image_urls, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                req.user.id,
                title,
                description || null,
                category || null,
                location_found,
                date_found || null,
                image_urls || null,
                status || "found"
            ]
        );

        res.status(201).json({
            message: "Found item reported successfully",
            found_item: result.rows[0],
        });
    } catch (error) {
        console.error("Create found item error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// =========================
// CLAIMS
// =========================

// GET all claims (Protected)
router.get("/claims", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM claims ORDER BY created_at DESC");
        res.json({ claims: result.rows });
    } catch (error) {
        console.error("Get claims error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST a claim (Protected)
router.post("/claims", authMiddleware, async (req, res) => {
    try {
        const { lost_item_id } = req.body;

        if (!lost_item_id) {
            return res.status(400).json({ message: "lost_item_id is required" });
        }

        const result = await pool.query(
            `INSERT INTO claims (lost_item_id, claimant_id, claim_status) 
             VALUES ($1, $2, $3) RETURNING *`,
            [lost_item_id, req.user.id, "pending"]
        );

        res.status(201).json({
            message: "Claim submitted successfully",
            claim: result.rows[0],
        });
    } catch (error) {
        console.error("Create claim error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;