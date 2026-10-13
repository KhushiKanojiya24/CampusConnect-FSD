const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// REST API Endpoint for Students (Assignment 8)
app.get('/api/students', (req, res) => {
    res.json([
        { roll: "101", name: "Khushi", m1: 85, m2: 90, m3: 88, total: 263, percentage: 87.67 }
    ]);
});

// Start Server on Port 5000
app.listen(5000, () => {
    console.log('🚀 CampusConnect Express Server running on http://localhost:5000');
});