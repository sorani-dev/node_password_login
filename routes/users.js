const router = require('express').Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const { redirectIfAuthenticated } = require('../config/auth')

const User = require('../models/User')

// Login Page
router.get('/login', redirectIfAuthenticated, (req, res) => res.render('login'))

// Register Page
router.get('/register', redirectIfAuthenticated, (req, res) => res.render('register'))

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body

    let errors = []
    // Check required fields
    if (!name || !email || !password || !password2) {
        errors = [...errors, { msg: 'Please fill in all fields' }]
    }

    // Check password match
    if (password !== password2) {
        errors = [...errors, { msg: 'Passwords do not match' }]
    }

    // Check password length
    if (password.length < 6) {
        errors = [...errors, { msg: 'Password should be at least 6 characters long' }]
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email
        })
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors = [...errors, { msg: 'Email is already registered' }]
                    return res.render('register', {
                        errors,
                        name,
                        email
                    })
                }
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // Hash Password
                bcrypt.genSalt(12, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, encryptedPassword) => {
                        if (err) throw err

                        // Set password to hashed
                        newUser.password = encryptedPassword
                        // Save the user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect('/users/login')
                            })
                            .catch(err => console.error(err))
                    }))
            })
    }
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router
