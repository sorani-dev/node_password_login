module.exports = {
    ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Please log in to view this resource')
        res.redirect('/users/login')
    },
    redirectIfAuthenticated(req, res, next) {
        // Redirect if the user is logged in
        if (req.isAuthenticated()) {
            // req.flash('error_msg', 'You cannot access this page')
            return res.redirect('/dashboard')
        }
        return next()
    },
}