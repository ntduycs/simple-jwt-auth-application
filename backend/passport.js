const jwtStrategy = require('passport-jwt').Strategy
const extractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')

const User = mongoose.model('users')

const options = {}

options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = 'secret'

module.exports = passport => {
    passport.use(new jwtStrategy(options, (jwtPayload, done) => {
        User.findById(jwtPayload.id)
            .then(res => res ? done(null, user) : done(null, false))
            .catch(err => console.error(err))
    }))
}