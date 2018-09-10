//RUTAS INDEX

var presidentController = require('../../controllers/presidentController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {
    
    app.get('/president',isLoggedIn, presidentController.index);

    app.get('/president/auto', isLoggedIn, presidentController.autoEval);

    app.get('/president/detalles/:id',isLoggedIn, presidentController.detalles);

    app.post('/president/detalles/:id',isLoggedIn, presidentController.observacion);

    //este controlador sera para los examenes culminados de tipo "Evaluacion al Subordinado"
    app.get('/president/culminado/:id/u/:idu/ue/:idue',isLoggedIn, presidentController.culminado);

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