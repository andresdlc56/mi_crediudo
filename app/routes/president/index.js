//RUTAS INDEX

var presidentController = require('../../controllers/presidentController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {
    
    app.get('/president',isLoggedIn, presidentController.index);

    //ver Evaluaciones Planificadas
    app.get('/president/evalPlani', isLoggedIn, presidentController.evalPlanificadas);

    //Ver Evaluaciones en Proceso
    app.get('/president/evalProceso', isLoggedIn, presidentController.evalProceso);

    //Ver Evaluaciones Culminadas
    app.get('/president/evalCulmi', isLoggedIn, presidentController.evalCulmi);

    //Ver lista de Nucleos
    app.get('/president/nucleos', isLoggedIn, presidentController.nucleos);

    //ver Evaluaciones planificadas en una Unidad especifica
    app.get('/president/nucleos/unidad/:id', isLoggedIn, presidentController.getEvaluaciones);

    //buscar unidades pertenecientes a un nucleo
    app.get('/president/nucleo/:id', presidentController.getUnidades);

    //Ver lista de Unidades de un Nucleo Seleccionado
    app.get('/president/nucleos/:id', isLoggedIn, presidentController.unidades);

    

    app.get('/president/auto', isLoggedIn, presidentController.autoEval);

    app.get('/president/detalles/:id',isLoggedIn, presidentController.detalles);

    app.post('/president/detalles/:id',isLoggedIn, presidentController.observacion);

    //Ruta para ver el personal de la unidad que estasiendo evaluada
    app.get('/president/detalles/:id/personal',isLoggedIn, presidentController.verPersonal);    

    app.get('/president/detalles/:id/personal/:idUser', isLoggedIn, presidentController.verCalificacion);

    app.post('/president/detalles/:id/personal/:idUser', isLoggedIn, presidentController.calificar);




    app.post('/president/detalles/editObs/:id', isLoggedIn, presidentController.editObserv);

    //Ruta para ver detalles de una autoEvaluación Concluida
    app.get('/president/detalles/:id/verAutoe/:idUser', isLoggedIn, presidentController.verAutoEval);

    //Ruta para ver detalles de una CoEvaluación concluida
    app.get('/president/detalles/:id/vercoEval/:idUser/:idEvaluador', isLoggedIn, presidentController.verCoEval);

    //Ruta para ver detalles de una Eval A Subordinado concluida
    app.get('/president/detalles/:id/verEvalSubor/:idEvaluador/:idUser', isLoggedIn, presidentController.verEvalSubor);

    //Ruta para ver detalles de una Eval A Jefe concluida
    app.get('/president/detalles/:id/verEvalJefe/:idEvaluador/:idUser', isLoggedIn, presidentController.verEvalJefe);



    app.get('/president/cambiar_coordP', isLoggedIn, presidentController.cambiarCoordPla);

    app.get('/getCoordP', presidentController.getCoordP);

    app.get('/getUsuario/:id', presidentController.getUsuario);





    //Ruta Para cambiar al coord Eval de CREDIUDO
    app.get('/president/cambiar_coordP/:id', isLoggedIn, presidentController.cambiarCoordP);

    app.post('/president/cambiar_coordP/:id/buscar', isLoggedIn, presidentController.buscarCoordP);

    //Ruta Para cambiar al coord Plani de CREDIUDO
       

    //este controlador sera para los examenes culminados de tipo "Evaluacion al Subordinado"
    app.get('/president/culminado/:id/u/:idu/ue/:idue',isLoggedIn, presidentController.culminado);

    app.post('/president/observacion/:id',isLoggedIn, presidentController.observacion);    

    app.get('/president/historial', isLoggedIn, presidentController.historial);

    //Buscar Calificaciones de Unidad
    app.get('/getCalifi', presidentController.getCalifi);


    //este controlador sera para los examenes culminados de tipo "Evaluacion al Jefe"
    //app.get('/president/culminado/:id/u/:idu',isLoggedIn, presidentController.culminado_b);

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}