const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connect to Mongo DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("MongoDB has been connected"));

//Middleware
app.use(express.json());

//Routes Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server running!'));