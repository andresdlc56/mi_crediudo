//RUTAS INDEX

var empleadoController = require('../../controllers/empleadoController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    app.get('/dashboard/eval/:id', isLoggedIn, empleadoController.index);

    app.get('/dashboard/coEval/:id', isLoggedIn, empleadoController.verCoEval);

    app.get('/dashboard/eval-a-jefe/:id', isLoggedIn, empleadoController.verEvalAJefe);

    app.get('/dashboard/eval-a-subord/:id', isLoggedIn, empleadoController.verEvalaSubor);

    /*HACIENDO UNA PRUEBA PARA VER EL EXAMEN*/
    app.get('/dashboard/eval/:id/u/:idu', isLoggedIn, empleadoController.prueba);

    app.post('/dashboard/eval/:id/u/:idu',isLoggedIn, empleadoController.procesarPrueba);
    /*FIN DE PRUEBA*/

    app.get('/dashboard/eval/:id/u/:idu/ue/:idue',isLoggedIn, empleadoController.evaluacion);

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