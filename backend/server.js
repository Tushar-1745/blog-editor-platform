const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { connectDB } = require('./src/config/db');  // import from your db.js
const blogRoutes = require('./src/routes/blogRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

connectDB();  // connect to MySQL

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
