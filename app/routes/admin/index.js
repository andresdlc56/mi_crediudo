//RUTAS INDEX

var adminController = require('../../controllers/adminController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    //RUTA INICIAL DEL USUARIO ADMIN
    app.get('/admin',isLoggedIn, adminController.index);

    //RUTA PARA ASIGNAR EL ROL "PRESIDENTE" A UN USUARIO CON ROL "EMPLEADO"
        app.get('/admin/asignar-presi', isLoggedIn, adminController.asignarPresi);
        app.post('/admin/asignar-presi', isLoggedIn, adminController.asignaPresi);

        //Cambiar Presidente
            app.get('/admin/cambiarPresidente', isLoggedIn, adminController.cambiarPresi);
            app.post('/admin/updatePresidente', isLoggedIn, adminController.reemplazar);
       
            


    //RUTA PARA ASIGNAR EL ROL "Coord Planificacion" A UN USUARIO CON ROL "Empleado"
        app.get('/admin/asignar-coordP', isLoggedIn, adminController.asignarCoordP);
        app.post('/admin/asignar-coordP', isLoggedIn, adminController.asignaCoordP);
        
            

    //RUTA PARA ASIGNAR EL ROL "Coord Evaluación" A UN USUARIO CON ROL "Empleado"
        app.get('/admin/asignar-coordE', isLoggedIn, adminController.asignarCoordE);
        app.post('/admin/asignar-coordE', isLoggedIn, adminController.asignaCoordE);


    //Remplazar Presidente
        app.post('/admin/reemplazar', isLoggedIn, adminController.reemplazar);
        
            

    /*========================Rutas Axios================================*/
        app.get('/admin/buscarUsuario/:id', isLoggedIn, adminController.buscarUsuario);
        app.get('/admin/getAdmin', isLoggedIn, adminController.getAdmin);
        app.get('/admin/getPresidente', isLoggedIn, adminController.getPresidente);
        app.get('/admin/getCoordPlani', isLoggedIn, adminController.getCoordPlani);
    

    

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}