//RUTAS INDEX

var presidentController = require('../../controllers/presidentController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {
    
    app.get('/president',isLoggedIn, presidentController.index);

    app.get('/president/auto', isLoggedIn, presidentController.autoEval);

    app.get('/president/detalles/:id',isLoggedIn, presidentController.detalles);

    app.post('/president/detalles/:id',isLoggedIn, presidentController.observacion);

    app.post('/president/detalles/editObs/:id', isLoggedIn, presidentController.editObserv);

    //Ruta para ver detalles de una autoEvaluación Concluida
    app.get('/president/detalles/:id/verAutoe/:idUser', isLoggedIn, presidentController.verAutoEval);

    //Ruta para ver detalles de una CoEvaluación concluida
    app.get('/president/detalles/:id/vercoEval/:idUser/:idEvaluador', isLoggedIn, presidentController.verCoEval);

    //Ruta para ver detalles de una Eval A Subordinado concluida
    app.get('/president/detalles/:id/verEvalSubor/:idEvaluador/:idUser', isLoggedIn, presidentController.verEvalSubor);

    //Ruta para ver detalles de una Eval A Jefe concluida
    app.get('/president/detalles/:id/verEvalJefe/:idEvaluador/:idUser', isLoggedIn, presidentController.verEvalJefe);

    //este controlador sera para los examenes culminados de tipo "Evaluacion al Subordinado"
    app.get('/president/culminado/:id/u/:idu/ue/:idue',isLoggedIn, presidentController.culminado);

    app.post('/president/observacion/:id',isLoggedIn, presidentController.observacion);    

    app.get('/president/historial', isLoggedIn, presidentController.historial);


    //este controlador sera para los examenes culminados de tipo "Evaluacion al Jefe"
    //app.get('/president/culminado/:id/u/:idu',isLoggedIn, presidentController.culminado_b);

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}