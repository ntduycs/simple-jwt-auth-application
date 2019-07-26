const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const router = express.Router()

const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')

const User = require('../models/User')

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) {
        console.error('Error')
        return res.status(400).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then(found => {
            if (found) {
                return res.status(400).json({ email: 'Email already exists' })
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', r: 'pg', d: 'mm'
                })

                const createdUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                })

                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.error('There was an error', err)
                    } else {
                        bcrypt.hash(createdUser.password, salt, (err, hash) => {
                            if (err) {
                                console.error('There was an error', err)
                            } else {
                                createdUser.password = hash
                                createdUser.save()
                                    .then(user => res.json(user))
                                    .catch(err => console.error('Error when save new user', err))
                            }
                        })
                    }
                })
            }
        })
})

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    const { email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = 'User not found'
                return res.status(400).json(errors)
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }

                        jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
                            if (err) {
                                console.error('There is an error in token', err)
                            } else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`,
                                    name: payload.name
                                })
                            }
                        })
                    } else {
                        errors.password = 'Incorrect password'
                        return res.status(400).json(errors)
                    }
                })
        })
})

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        name: res.user.name,
        email: req.user.email
    })
})

module.exports = router;