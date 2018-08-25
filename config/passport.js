const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/index');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (jwtPayload, done) => {
            User.findById(jwtPayload.id).then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            }).catch(err => console.log(err));
        })
    );
};
