const express = require('express');
const path = require('path');

const app = express();
const port = 5500;

// Serve static files from the homepage directory
app.use(express.static(path.join(__dirname, '../homepage')));

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
