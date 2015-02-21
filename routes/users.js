exports.list = function(req, res) {
    res.send('respond with a resource');
};

exports.login = function(req, res, next) {
    res.render('login');
};

/*
* GET logout route.
 */

exports.logout = function(req, res, next) {
    res.redirect('/');
};

/*
 * POST authenticate route
 */

exports.authenticate = function(req, res, next) {
    res.redirect('/admin');
};