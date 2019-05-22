//RUTAS INDEX

var indexController = require('../controllers/indexController.js');
var authController = require('../controllers/authController.js');

module.exports = function(app,passport) {
    //app.get('/signup', authController.signup);

    //RUTA INICIAL INDEX
    app.get('/', indexController.index);

    app.get('/etapas', indexController.etapas);

    //RUTA DE INICIO DE SESION
    app.get('/login', authController.signin);

    //RUTA INICIO DE SESION USUARIO CREDIUDO
    app.get('/loginCrediudo', authController.signinCrediudo);

    //RUTA INICIAL PARA LOS USUARIOS EMPLEADOS QUE HAN INICIADO SESION
    app.get('/dashboard', isLoggedIn, authController.dashboard);

    app.get('/userCrediudo', isLoggedIn, authController.userCrediudo);

    //RUTA PARA EL PROCESAMIENTO DE LOS USUARIOS QUE INTENTAN LOGEARSE 
    app.post('/login', passport.authenticate('local-signin', {
	        successRedirect: '/dashboard',
	        failureRedirect: '/login',
            failureFlash: 'Cedula o Password Incorrecto'
	    }
	));

    //RUTA PARA EL LOGUEO DE USUARIOS CREDIUDO
    app.post('/loginCrediudo', passport.authenticate('local-signinCrediudo', {
        successRedirect: '/userCrediudo',
        failureRedirect: '/loginCrediudo',
        failureFlash: true
    }
    ));

    app.get('/objetivos', indexController.objetivos);

    //================Rutas axios=============

    //RUTA PARA FINALIZAR SESION
    app.get('/logout',authController.logout);

    //FUNCION PARA COMPROBAR SI EL USUARIO A INICIADO SESION 
        //HAY Q ARREGLAR ALGUNOS DETALLES IMPORATNTES, NO ES TOTALMENTE SEGURA 
	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}