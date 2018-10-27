//RUTAS INDEX

var empleadoController = require('../../controllers/empleadoController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    app.get('/dashboard/eval/:id', isLoggedIn, empleadoController.index);

    app.get('/dashboard/evaluacion/:id/u/:idu/ue/:idue',isLoggedIn, empleadoController.evaluacion);

    app.post('/dashboard/evaluacion/:id/u/:idu/ue/:idue',isLoggedIn, empleadoController.procesarEval);

    app.get('/dashboard/observaciones/:id',isLoggedIn, empleadoController.observaciones);

    app.get('/dashboard/comparacion',isLoggedIn, empleadoController.comparacion);

    app.post('/dashboard/comparar',isLoggedIn, empleadoController.comparar);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}