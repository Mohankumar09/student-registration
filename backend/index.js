require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mohan123!',
  database: 'student_db',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL Database');
  }
});

// API to Get All Students
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// API to Add a New Student
app.post('/students', (req, res) => {
  const { name, emailId, contactNo, city, state, pincode, address } = req.body;
  const sql = 'INSERT INTO students (name, emailId, contactNo, city, state, pincode, address) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [name, emailId, contactNo, city, state, pincode, address], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Student added successfully', id: result.insertId });
  });
});

// API to Update a Student
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, emailId, contactNo, city, state, pincode, address } = req.body;
  const sql = 'UPDATE students SET name=?, emailId=?, contactNo=?, city=?, state=?, pincode=?, address=? WHERE studentId=?';
  
  db.query(sql, [name, emailId, contactNo, city, state, pincode, address, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: 'Student updated successfully' });
  });
});

// API to Delete a Student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM students WHERE studentId = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: 'Student data deleted successfully' });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
