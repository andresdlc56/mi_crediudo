//================RUTAS USUARIOS CREDIUDO==================

var coord_evController = require('../../controllers/coord_evController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {
    app.get('/', authController.userCrediudo);
    

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}