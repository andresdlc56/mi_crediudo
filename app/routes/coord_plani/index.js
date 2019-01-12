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

    app.get('/getNucleos', coord_planiController.getNucleos);

    app.get('/getUnidades/:id', coord_planiController.getUnidades);

    //=========================Rutas Axios========================
        app.get('/coord_plani/getInstrumentos', isLoggedIn, coord_planiController.getInstrumentos);

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}