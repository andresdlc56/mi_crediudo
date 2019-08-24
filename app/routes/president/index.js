//RUTAS INDEX

var presidentController = require('../../controllers/presidentController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {
    /*==============Ruta Inicial del Presidente de CREDIUDO===========*/
        app.get('/president',isLoggedIn, presidentController.index);

    /*==============Ruta para ver las evaluaciones que no han culminado segun la fecha====*/
        app.get('/president/evalProceso', isLoggedIn, presidentController.evalProceso);

        /*--------------Ruta para ver en detalle el desarrollo de una unidad en una evaluacion----*/
            app.get('/president/detalles/:id',isLoggedIn, presidentController.detalles);

            //------Ruta para ver detalles de una autoEvaluación Concluida-----------
                app.get('/president/detalles/:id/verAutoe/:idUser', isLoggedIn, presidentController.verAutoEval);

            //------Ruta para ver detalles de una CoEvaluación concluida-----------
                app.get('/president/detalles/:id/vercoEval/:idUser/:idEvaluador', isLoggedIn, presidentController.verCoEval);

            //------Ruta para ver detalles de una Eval A Subordinado concluida---------
                app.get('/president/detalles/:id/verEvalSubor/:idEvaluador/:idUser', isLoggedIn, presidentController.verEvalSubor);

            //------Ruta para ver detalles de una Eval A Jefe concluida------------- 
                app.get('/president/detalles/:id/verEvalJefe/:idEvaluador/:idUser', isLoggedIn, presidentController.verEvalJefe);

    /*==========Ruta para empezar a evaluar al personal de una unidad (home)==========*/
        app.get('/president/detalles/:id/personal',isLoggedIn, presidentController.verPersonal); 

        /*----------------Ruta para ver los resultados de un usuario en una evluacion y calificarlo-------------*/
            app.get('/president/detalles/:id/personal/:idUser', isLoggedIn, presidentController.verCalificacion);

        /*-------------Ruta para Enviar una Observacion --------*/
            app.post('/president/detalles/:id/personal/:idUser', isLoggedIn, presidentController.calificar);


    //ver Evaluaciones Planificadas
    app.get('/president/evalPlani', isLoggedIn, presidentController.evalPlanificadas);

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

    app.post('/president/detalles/:id',isLoggedIn, presidentController.observacion);

    app.post('/president/detalles/editObs/:id', isLoggedIn, presidentController.editObserv);

    app.get('/president/cambiar_coordP', isLoggedIn, presidentController.cambiarCoordPla);

    app.get('/president/cambiar_coordE', isLoggedIn, presidentController.cambiarCoordEval);

    app.get('/getCoordP', presidentController.getCoordP);

    app.get('/getCoordE', presidentController.getCoordE);

    app.get('/getUsuario/:id', presidentController.getUsuario);

    //Ruta Para cambiar al coord Eval de CREDIUDO
    app.get('/president/cambiar_coordP/:id', isLoggedIn, presidentController.cambiarCoordP);

    app.post('/president/cambiar_coordP/:id/buscar', isLoggedIn, presidentController.buscarCoordP);

    //Ruta Para cambiar al coord Plani de CREDIUDO
       

    //este controlador sera para los examenes culminados de tipo "Evaluacion al Subordinado"
    app.get('/president/culminado/:id/u/:idu/ue/:idue',isLoggedIn, presidentController.culminado);

    app.post('/president/observacion/:id',isLoggedIn, presidentController.observacion);    

    app.get('/president/historial', isLoggedIn, presidentController.historial);

    //Guardar Calificacion de Unidad
    app.post('/president/califiUnidad/:id', presidentController.saveCalifi);

    //================Ver el Perfil de un Usuario de una determinada Unidad=====
    app.get('/president/nucleos/unidad/:unidadCodigo/userPerfil/:userCedula', isLoggedIn, presidentController.userPerfil);

    app.get('/president/userPerfil/:userCedula/eval/:evalId', isLoggedIn, presidentController.detallesEvalUser);

    app.get('/president/userPerfil/:userCedula/eval/:idEval/getObservacion', isLoggedIn, presidentController.getObservacion)

    //Ruta para actualizar o reemplazar a un coordinador
    app.post('/president/updateCoord', isLoggedIn, presidentController.reemplazar);

    app.get('/president/asignar-CoordP', isLoggedIn, presidentController.asignarCoordP);
    app.post('/president/asignar-CoordP', isLoggedIn, presidentController.asignaCoordP);

    app.get('/president/asignar-CoordE', isLoggedIn, presidentController.asignarCoordE);
    app.post('/president/asignar-CoordE', isLoggedIn, presidentController.asignaCoordE);

    app.get('/president/asignar-CoordProces', isLoggedIn, presidentController.asignarCoordProces);
    app.post('/president/asignar-CoordProces', isLoggedIn, presidentController.asignaCoordProces);
    //este controlador sera para los examenes culminados de tipo "Evaluacion al Jefe"
    //app.get('/president/culminado/:id/u/:idu',isLoggedIn, presidentController.culminado_b);

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}