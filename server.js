const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// --- Database Connection with Hard-coded Credentials ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'loch7760',
    database: 'expensess_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to MySQL database.');
});

// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// --- API Route for Signup ---
app.post('/user/signup', (req, res) => {
    const { name, email, password } = req.body;

    // A real app should hash passwords. This is for demonstration.
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    const values = [name, email, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'This email is already registered.' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error during signup.' });
        }
        console.log(`User ${name} created with ID: ${result.insertId}`);
        return res.status(201).json({ message: `Signup successful! Welcome, ${name}.` });
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});