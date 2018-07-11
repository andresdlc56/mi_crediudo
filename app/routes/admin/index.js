//RUTAS INDEX

var adminController = require('../../controllers/adminController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    app.get('/admin',isLoggedIn, adminController.index);

    app.get('/admin/asignar-coordP', isLoggedIn, adminController.asignarCoordP);

    app.get('/admin/asignar-coordE', isLoggedIn, adminController.asignarCoordE);

    app.post('/admin/buscar', isLoggedIn, adminController.buscar);

    /*
    app.get('/login', authController.signin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.post('/login', passport.authenticate('local-signin', {
	        successRedirect: '/dashboard',
	        failureRedirect: '/login'
	    }
	));
	*/
    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}