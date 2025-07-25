const express = require("express");
const db = require("./db");

// Define express app
const app = express();
const port = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));
app.get("/api/greet", (req, res) => {
  const name = req.query.name || "World";
  res.json({ message: `Hello, ${name}!` });
});
app.get("/api/students", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});
app.post("/api/students", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Student name is required" });
    }
    
    const result = await db.query(
      "INSERT INTO students (name) VALUES ($1) RETURNING *",
      [req.body.name]
    );
    
    // Return the newly created student (with ID and name)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting student" });
  }
});

// Start the server
app.listen(port, () => console.log(`App running on port ${port}`));
