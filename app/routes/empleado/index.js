//RUTAS INDEX

var empleadoController = require('../../controllers/empleadoController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    app.get('/dashboard/evaluacion/:id/u/:idu',isLoggedIn, empleadoController.evaluacion);


	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}