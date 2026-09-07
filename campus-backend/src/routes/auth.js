const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authenticateToken = require("../middleware/auth");

const pool = require("../config/db");

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            department,
            year
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate UUID
        const userId = crypto.randomUUID();

        // Insert user into Supabase
        const result = await pool.query(
            `INSERT INTO users
            (id, name, email, password, role, department, year)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, email, role, department, year, created_at`,
            [
                userId,
                name,
                email,
                passwordHash,
                role || "student",
                department || null,
                year || null
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                year: user.year
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// GET CURRENT USER
// =========================
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, role, department, year, created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Get user error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;