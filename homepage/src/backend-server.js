
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from homepage directory
app.use(express.static(path.join(__dirname, '..', 'homepage')));

// Since Firebase Authentication will handle user registration, login, and email verification,
// backend will only serve static files and can be extended for other APIs if needed.

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'homepage', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
