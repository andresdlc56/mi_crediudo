//RUTAS INDEX

var coord_planiController = require('../../controllers/coord_planiController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    //================Ruta Inicial===============
    app.get('/coord_plani',isLoggedIn, coord_planiController.index);

    //=======================Ruta para Planificar una Evaluación(formulario)===========
    app.get('/coord_plani/plani_eval', isLoggedIn, coord_planiController.planiEval);

    app.post('/coord_plani/plani_eval', isLoggedIn, coord_planiController.addEval);
    
    app.get('/coord_plani/eval_encurso', isLoggedIn, coord_planiController.eval_encurso);

    app.post('/coord_plani/eval_encurso', isLoggedIn, coord_planiController.update_eval);   

    app.get('/coord_plani/eval_culminado', isLoggedIn, coord_planiController.eval_culminado);

    app.get('/coord_plani/deleteEval/:id', isLoggedIn, coord_planiController.deleteEval);

    app.get('/coord_plani/editEval/:id', isLoggedIn, coord_planiController.editEval);

    app.post('/coord_plani/editEval/:id', isLoggedIn, coord_planiController.actualizaEval);

    app.get('/coord_plani/verTodas', isLoggedIn, coord_planiController.verTodas);

    //app.get('/getNucleos', coord_planiController.getNucleos);

    app.get('/getUnidades/:id', coord_planiController.getUnidades);

    //=========================Rutas Axios========================
        app.get('/coord_plani/getInstrumentos', isLoggedIn, coord_planiController.getInstrumentos);

        app.get('/coord_plani/getEvaluacionesTodas', coord_planiController.getEvaluacionesTodas);

        app.get('/getEvaluacion/:id', coord_planiController.getEvaluacion);

        app.get('/getNucleos/:categoriaId', coord_planiController.getNucleos);

        app.get('/getCategorias', coord_planiController.getCategorias);

        app.get('/getUnidades/:id/:categoriaId', coord_planiController.getUnidades);

        app.get('/coord_plani/getUsuario', coord_planiController.getUsuario);


    //==============Actualizar Datos====================
        app.get('/coord_plani/actualizarDatos', isLoggedIn, coord_planiController.actualizarDatos);

        app.post('/coord_plani/updateDatos', isLoggedIn, coord_planiController.updateDatos);

        app.post('/coord_plani/passwordUpdate', isLoggedIn, coord_planiController.passwordUpdate);

    //=============Gestionar Noticias===============================
        app.get('/coord_plani/agregarNoticias', isLoggedIn, coord_planiController.agergarNoticias);

        app.post('/coord_plani/addNoticia', isLoggedIn, coord_planiController.addNoticia);

        app.get('/coord_plani/verNoticia/:id', isLoggedIn, coord_planiController.verNoticia);

        app.get('/coord_plani/editNoticia/:id', isLoggedIn, coord_planiController.editNoticia);

        /*------Axios Solicitar Noticia--------*/
            app.get('/coord_plani/getNoticia/:id', isLoggedIn, coord_planiController.getNoticia);

        app.post('/coord_plani/updateNoticia', isLoggedIn, coord_planiController.updateNoticia);

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}