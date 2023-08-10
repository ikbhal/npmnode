const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const { exec } = require('child_process');

const app = express();
const PORT = 3022;

app.set('view engine', 'ejs'); // Set the view engine to EJS

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'muhammed',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Set up a basic route
app.get('/', (req, res) => {
  res.render('index', { message: req.flash('message'), output: req.flash('output') });
});

// Route to handle npm install commands
app.post('/npm-install', (req, res) => {
//   const preselect = req.body.preselect;
//   const parameter1 = req.body.parameter1;
  const directory = req.body.directory || process.cwd(); // Use current directory if not provided

  // Construct the npm install command
  const npmInstallCommand = `npm install`;

  // Execute the npm install command with sudo
  exec(`sudo npm -C "${directory}" ${npmInstallCommand}`, (error, stdout, stderr) => {
    if (error) {
      req.flash('message', 'Error: ' + error.message);
    } else {
      req.flash('message', 'Command executed successfully.');
      req.flash('output', stdout);
    }
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
