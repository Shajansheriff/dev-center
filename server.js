const express = require('express');
const mongoose = require('mongoose');

// load routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
const config = require('./config/index');

mongoose.connect(config.mongoURI)
        .then(() => console.log('MongoDB connected.'))
        .catch((error) => console.log(error));

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));