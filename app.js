const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

const path = require('path')

const app = express()

// DB Config
const db = require('./config/keys').MongoURI


// Passport Config
require('./config/passport')(passport)

// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log('Connected'))
    .catch(err => console.error(err))

// EJS Middleware
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))

// BodyParser Middleware
app.use(express.urlencoded({ extended: false }))

// Express Session Middleware
const sess = {
    secret: 'keyboard cat',
    cookie: {},
    resave: true,
    saveUninitialized: true,
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // Trust first proxy
    sess.cookie.secure = true;// serve secure cookies
}

app.use(session(sess))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash Middleware
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
