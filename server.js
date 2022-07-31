const express = require('express');
const dotenv = require('dotenv');

const morgan = require('morgan');
const colors = require('colors');
dotenv.config({ path: './config/config.env' }); // Load env vars

// Load Database db file
// const connectDB = require('./config/db');

// Connect to Database
// connectDB();

// Load Routes
const auth = require('./routes/auth');
const messages = require('./routes/messages');
const app = express();
// Body Parser
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1/auth', auth);
app.use('/api/v1/messages', messages);

app.get('/', (req, res) => {
  res.send('Hello from express');
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
