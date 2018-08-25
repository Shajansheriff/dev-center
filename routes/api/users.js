const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// load config
const config = require('../../config/index');

// load Models
const User = require('../../models/User');

router.get('/', (req, res) => res.json({'msg': 'success'}));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    let requestData = req.body;
    User.findOne({'email': requestData.email})
        .then(user => {
           if (user) {
               return res.status(400).json({'email': 'email already exists'});
           } else {
               const newUser = new User(requestData);
               newUser.avatar = gravatar.url(requestData.email, {s: '200', r: 'pg', d: '404'});
               bcrypt.genSalt(10, (err, salt) => {
                   bcrypt.hash(newUser.password, salt, (err, hash) => {
                       console.log(hash)
                       if (err) throw err;
                       newUser.password = hash;
                       newUser.save().then(user => res.json(user))
                           .catch(err => console.log(err));
                   })
               })
           }
        });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}).then((user) => {
      if (!user) {
          return res.status(400).json({email: 'Invalid Email'});
      }
      bcrypt.compare(password, user.password)
          .then(isValidPassword => {
              if (isValidPassword) {
                  const {id, name, avatar} = user;
                  const payload = {id, name, avatar};
                  jwt.sign(
                      payload,
                      config.secretOrKey,
                      { expiresIn: 1800 },
                      (err, token) => {
                          res.json({'token': 'Bearer' + token, success: true});
                      });
              } else {
                  return res.status(400).json({error: 'Invalid email/password'})
              }
          });
    });

});

module.exports = router;