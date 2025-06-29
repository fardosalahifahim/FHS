const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // to parse JSON body

// Serve static files from the homepage directory
app.use(express.static(path.join(__dirname)));

// Remove static serving of profile folder
// app.use('/user/profile', express.static(path.join(__dirname, 'profile')));

const profiles = {}; // In-memory store for profiles, replace with DB in production

// API endpoint to get profile data for authenticated user
app.get('/api/profile/:uid', (req, res) => {
  const uid = req.params.uid;
  console.log(`GET /api/profile/${uid} called`);

  // Simple auth check: in real app, verify user session or token
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer valid-token') {
    console.log('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const profile = profiles[uid];
  if (!profile) {
    console.log(`Profile not found for ${uid}`);
    return res.status(404).json({ error: 'Profile not found' });
  }

  console.log(`Profile found for ${uid}:`, profile);
  res.json(profile);
});

// API endpoint to get all profiles
app.get('/api/profiles', (req, res) => {
  // Simple auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer valid-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const allProfiles = Object.values(profiles);
  res.json(allProfiles);
});

// API endpoint to create or update profile data
app.post('/api/profile', (req, res) => {
  const { uid, registrationInfo } = req.body;
  console.log(`POST /api/profile called with uid: ${uid}`);

  if (!uid || !registrationInfo) {
    console.log('Missing uid or registrationInfo in request body');
    return res.status(400).json({ error: 'Missing uid or registrationInfo' });
  }

  profiles[uid] = registrationInfo;
  console.log(`Profile saved for ${uid}:`, registrationInfo);

  res.json({ message: 'Profile saved successfully' });
});

// Serve registration.html as the root page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/user/profile/profile.html', (req, res) => {
  const id = req.query.id;

  // Check for session cookie or query param for authentication
  const sessionId = req.cookies.sessionId;
  if (!sessionId || sessionId !== id) {
    // Redirect to login page if not authenticated
    return res.redirect('/login.html');
  }

  // Find profile by id (uid)
  const profile = Object.values(profiles).find(p => p.idNumber === id || p.uid === id);
  if (!profile) {
    return res.status(404).send('Profile not found');
  }

  // Determine if visitor is owner of profile
  const isOwner = id && (id === profile.idNumber || id === profile.uid);

  // Render HTML with public and private sections and editing for owner
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Profile of ${profile.name}</title>
  <link rel="stylesheet" href="/server.css" />
</head>
<body>
  <div class="profile-header">
    <img src="https://via.placeholder.com/150" alt="Profile Picture" class="profile-picture" />
    <h1>${profile.name}</h1>
  </div>
  <div class="profile-container">
    <h2>Public Information</h2>
    <ul>
      <li><strong>Name:</strong> ${profile.name}</li>
      <li><strong>Section:</strong> ${profile.section}</li>
      <li><strong>Class:</strong> ${profile.class}</li>
    </ul>
    ${isOwner ? `
    <div class="private-section">
      <h2>Private Information</h2>
      <ul>
        <li><strong>ID Number:</strong> ${profile.idNumber}</li>
        <li><strong>Phone:</strong> ${profile.phone}</li>
        <li><strong>Email:</strong> ${profile.email}</li>
        <li><strong>Roll Number:</strong> ${profile.rollnumber}</li>
        <li><strong>Shift:</strong> ${profile.shift}</li>
      </ul>
      <button id="editProfileBtn">Edit Profile</button>
      <div id="editForm" style="display:none;">
        <h3>Edit Your Profile</h3>
        <form id="profileForm">
          <label>Name: <input type="text" name="name" value="${profile.name}" /></label><br/>
          <label>Section: <input type="text" name="section" value="${profile.section}" /></label><br/>
          <label>Class: <input type="text" name="class" value="${profile.class}" /></label><br/>
          <label>ID Number: <input type="text" name="idNumber" value="${profile.idNumber}" readonly /></label><br/>
          <label>Phone: <input type="text" name="phone" value="${profile.phone}" /></label><br/>
          <label>Email: <input type="email" name="email" value="${profile.email}" /></label><br/>
          <label>Roll Number: <input type="text" name="rollnumber" value="${profile.rollnumber}" /></label><br/>
          <label>Shift: <input type="text" name="shift" value="${profile.shift}" /></label><br/>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
    <script>
      document.getElementById('editProfileBtn').addEventListener('click', () => {
        const form = document.getElementById('editForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
      });
      document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: id, registrationInfo: data }),
        });
        if (response.ok) {
          alert('Profile updated successfully');
          location.reload();
        } else {
          alert('Failed to update profile');
        }
      });
    </script>
    ` : `
    <p><em>Private information is hidden. Please log in to view your full profile.</em></p>
    `}
  </div>
</body>
</html>
`;

  res.send(htmlContent);
});

// POST endpoint to create profile HTML file
app.post('/create-profile', (req, res) => {
  console.log('Received /create-profile request with body:', req.body);
  const { firstName, registrationInfo } = req.body;

  if (!firstName || !registrationInfo) {
    console.log('Missing firstName or registrationInfo in request body');
    return res.status(400).json({ error: 'Missing firstName or registrationInfo' });
  }

  const profileDir = path.join(__dirname, 'profile');

  // Create profile directory if it doesn't exist
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
    console.log('Created profile directory');
  }

  const filePath = path.join(profileDir, `${firstName}.html`);

  // Create HTML content based on registrationInfo
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Profile of ${firstName}</title>
</head>
<body>
  <h1>Profile of ${firstName}</h1>
  <ul>
    ${Object.entries(registrationInfo).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('\n    ')}
  </ul>
</body>
</html>
`;

  // Write the HTML file
  fs.writeFile(filePath, htmlContent, (err) => {
    if (err) {
      console.error('Error writing profile HTML file:', err);
      return res.status(500).json({ error: 'Failed to create profile HTML file' });
    }
    console.log(`Profile HTML file created successfully at ${filePath}`);
    res.json({ message: 'Profile HTML file created successfully' });
  });
});

app.get('/user/profile', (req, res) => {
  // Remove or disable this route as profile access is via /user/profile/:firstName.html only
  res.status(403).send('Access to this page is forbidden. Please access your profile via the feed.');
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
