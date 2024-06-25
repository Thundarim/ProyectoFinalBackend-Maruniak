const isAuthenticated = (req, res, next) => {
    if (req.session.login) {
        next();
    } else {
        res.redirect("/login");
    }
};

module.exports = isAuthenticated;
