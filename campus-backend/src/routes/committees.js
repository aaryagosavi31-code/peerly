const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Temporary data
let committees = [
    {
        id: 1,
        name: "Tech Club",
        description: "Student technology community",
        category: "Technical"
    },
    {
        id: 2,
        name: "Cultural Committee",
        description: "Organizes cultural activities",
        category: "Cultural"
    }
];


// GET all committees
router.get("/", (req, res) => {
    res.json(committees);
});


// GET committee by ID
router.get("/:id",authMiddleware,(req, res) => {

    const id = parseInt(req.params.id);

    const committee = committees.find(c => c.id === id);

    if (!committee) {
        return res.status(404).json({
            message: "Committee not found"
        });
    }

    res.json(committee);
});


// POST - create a committee
router.post("/", authMiddleware, (req, res) => {

    const { name, description, category } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Committee name is required"
        });
    }

    const newCommittee = {
        id: committees.length + 1,
        name,
        description,
        category
    };

    committees.push(newCommittee);

    res.status(201).json(newCommittee);
});


module.exports = router;