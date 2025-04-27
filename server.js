const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for file uploads (photo)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes placeholders
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory storage for registered students (for demo purposes)
const registeredStudents = [];

// Registration route
app.post('/register', upload.single('photo'), (req, res) => {
  try {
    const {
      fullName,
      schoolChoice,
      advancedLevel,
      studentType,
      nisn,
      originSchool,
      birthPlace,
      birthDate,
      address,
      phoneNumber,
      fatherName,
      motherName
    } = req.body;

    if (!req.file) {
      return res.status(400).send('Photo upload is required.');
    }

    // Save student data
    const studentData = {
      id: registeredStudents.length + 1,
      fullName,
      schoolChoice,
      advancedLevel,
      studentType,
      nisn,
      originSchool,
      birthPlace,
      birthDate,
      address,
      phoneNumber,
      fatherName,
      motherName,
      photoPath: req.file.path
    };

    registeredStudents.push(studentData);

require('dotenv').config();
const twilio = require('twilio');

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

const client = twilio(accountSid, authToken);

// Function to send WhatsApp notification
function sendWhatsAppNotification(to, message) {
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials are not set. WhatsApp notification not sent.');
    return;
  }
  client.messages
    .create({
      from: whatsappFrom,
      to: 'whatsapp:' + to,
      body: message,
    })
    .then(message => console.log('WhatsApp message sent, SID:', message.sid))
    .catch(error => console.error('Error sending WhatsApp message:', error));
}

// Registration route
app.post('/register', upload.single('photo'), (req, res) => {
  try {
    const {
      fullName,
      schoolChoice,
      advancedLevel,
      studentType,
      nisn,
      originSchool,
      birthPlace,
      birthDate,
      address,
      phoneNumber,
      fatherName,
      motherName
    } = req.body;

    if (!req.file) {
      return res.status(400).send('Photo upload is required.');
    }

    // Save student data
    const studentData = {
      id: registeredStudents.length + 1,
      fullName,
      schoolChoice,
      advancedLevel,
      studentType,
      nisn,
      originSchool,
      birthPlace,
      birthDate,
      address,
      phoneNumber,
      fatherName,
      motherName,
      photoPath: req.file.path
    };

    registeredStudents.push(studentData);

    // Send WhatsApp notification
    const message = `Halo ${fullName}, pendaftaran Anda telah berhasil diterima. Terima kasih telah mendaftar.`;
    sendWhatsAppNotification(phoneNumber, message);

    // For now, redirect to a simple success page or back to landing
    res.send(
      '<h1>Registrasi Berhasil</h1>' +
      '<p>Terima kasih, ' + fullName + ', pendaftaran Anda telah berhasil.</p>' +
      '<a href="/">Kembali ke Beranda</a>'
    );
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
});

// Admin login route
app.post('/login-admin', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded admin credentials
  if (username === 'admin' && password === 'admin123') {
    req.session.isAdmin = true;
    res.redirect('/admin-dashboard.html');
  } else {
    res.status(401).send('Username atau password admin salah.');
  }
});

// Student login route
app.post('/login-student', (req, res) => {
  const { nisn, birthDate } = req.body;
  const student = registeredStudents.find(s => s.nisn === nisn && s.birthDate === birthDate);
  if (student) {
    req.session.studentId = student.id;
    res.redirect('/student-dashboard.html');
  } else {
    res.status(401).send('NISN atau tanggal lahir salah.');
  }
});

const fs = require('fs');

// API route to get registered students data for admin dashboard
app.get('/api/students', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Access denied');
  }
  res.json(registeredStudents);
});

// API route to delete a student by ID
app.delete('/api/students/:id', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Access denied');
  }
  const studentId = parseInt(req.params.id, 10);
  const index = registeredStudents.findIndex(s => s.id === studentId);
  if (index === -1) {
    return res.status(404).send('Student not found');
  }
  registeredStudents.splice(index, 1);
  res.sendStatus(204);
});

// Serve admin dashboard page with session check
app.get('/admin-dashboard.html', (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/login-admin.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Serve student dashboard page with session check
app.get('/student-dashboard.html', (req, res) => {
  const studentId = req.session.studentId;
  if (!studentId) {
    return res.redirect('/login-student.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'student-dashboard.html'));
});

// API route to get logged-in student details
app.get('/api/student', (req, res) => {
  const studentId = req.session.studentId;
  if (!studentId) {
    return res.status(401).send('Unauthorized');
  }
  const student = registeredStudents.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).send('Student not found');
  }
  res.json(student);
});

// Logout route for admin
app.get('/logout-admin', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Gagal logout');
    }
    res.redirect('/login-admin.html');
  });
});

// Logout route for student
app.get('/logout-student', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Gagal logout');
    }
    res.redirect('/login-student.html');
  });
});

// Start server
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
