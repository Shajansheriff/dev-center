const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// load configs
const config = require('./config/index');

// load routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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