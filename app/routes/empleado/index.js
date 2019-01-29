//RUTAS INDEX

var empleadoController = require('../../controllers/empleadoController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    //==============Nuevas Rutas (Probando)===========================
        app.get('/dashboard/eval/:id', isLoggedIn, empleadoController.evaluaciones);

        //---------------Ruta para Realiazar la Prueba--------------
            app.get('/dashboard/eval/:id/u/:idu', isLoggedIn, empleadoController.prueba);

        //---------------Procesar Prueba-------------------------
            app.post('/dashboard/eval/:id/u/:idu', isLoggedIn, empleadoController.procesarPruebaOtro);

            //----------------Rutas axios-------------------
                //----------Solicitar autoEval disponibles---------------
                    app.get('/buscarAutoEval/:id/empleado/:cedula', empleadoController.buscarAutoE);

                //------------Solicitar coEvals disponibles----------------
                    app.get('/buscarCoEvals/:id/empleado/:cedula', empleadoController.buscarCoEvals);

                //------------Solicitar eval-a-jefe disponible-------------
                    app.get('/buscarEvalaJefe/:id/jefe/:cedula/empleado/:evaluador', empleadoController.buscarEvalaJefe);

                //-----------Solicitar eval-a-subor disponible-------------
                    app.get('/buscarEvalsaSubor/:id', empleadoController.buscarEvalsaSubor);

                //------------Cambiar el status de una notificacion a true(visto)---------
                    app.get('/cambiarStatus/:id', isLoggedIn, empleadoController.cambiarStatus)

        //-----------------Ver Calificacion de una Evaluacion--------------
            //app.get('/dashboard/verCalificacion/:id', isLoggedIn, empleadoController.verCalificacion);

            app.get('/dashboard/verResultado/:id', isLoggedIn, empleadoController.verResultado);

            app.get('/dashboard/resultadosTodos', isLoggedIn, empleadoController.resultadosTodos);

    //==================================================================================

    /*-------------Rutas sin definir su objetivo------------------------*/
            app.get('/dashboard/comparacion',isLoggedIn, empleadoController.comparacion);

            app.post('/dashboard/comparar',isLoggedIn, empleadoController.comparar);

    //=============================================================

    //===============funcion para logear un usuario============
	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}