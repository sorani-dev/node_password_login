const express = require('express')
const { ensureAuthenticated, redirectIfAuthenticated } = require('../config/auth')
const router = express.Router()

// Welcome Page
router.get('/', redirectIfAuthenticated, (req, res) => res.render('welcome'))

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    user: req.user
}))

module.exports = router
