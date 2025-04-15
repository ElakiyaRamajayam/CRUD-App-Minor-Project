const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/studentDB');

// GET all students
app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { students });
});

// POST to create new student
app.post('/save', async (req, res) => {
  const { rollNo, name, degree, city } = req.body;
  const student = new Student({ rollNo, name, degree, city });
  await student.save();
  res.redirect('/');
});

// GET form to edit student
app.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  const students = await Student.find();
  res.render('edit', { student, students }); // send current student data to edit
});

// POST to update student
app.post('/update/:id', async (req, res) => {
  const { rollNo, name, degree, city } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { rollNo, name, degree, city });
  res.redirect('/');
});

// GET to delete student
app.get('/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
