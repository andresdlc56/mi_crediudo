//RUTAS INDEX

var coord_evController = require('../../controllers/coord_evController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    app.get('/coord_ev',isLoggedIn, coord_evController.index);

    /*
    app.get('/admin/asignar-coordP', isLoggedIn, adminController.asignarCoordP);

    app.get('/admin/asignar-coordE', isLoggedIn, adminController.asignarCoordE);

    app.post('/admin/buscar_cp', isLoggedIn, adminController.buscar_cp);

    app.post('/admin/buscar_ce', isLoggedIn, adminController.buscar_ce);

    app.post('/admin/asignar-coordP', isLoggedIn, adminController.asignaCoordP);

    app.post('/admin/asignar-coordE', isLoggedIn, adminController.asignaCoordE);
    */
    //app.post('/admin/probando', isLoggedIn, adminController.probando);

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