//RUTAS INDEX

var indexController = require('../controllers/indexController.js');
var authController = require('../controllers/authController.js');

module.exports = function(app,passport) {
    //app.get('/signup', authController.signup);
    app.get('/', indexController.index);

    app.get('/login', authController.signin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.post('/login', passport.authenticate('local-signin', {
	        successRedirect: '/dashboard',
	        failureRedirect: '/login'
	    }
	));

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }

    //app.post('/login', indexController.iniciando);

    /*app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
    ));*/
}