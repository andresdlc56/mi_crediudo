//RUTAS INDEX

var coord_evController = require('../../controllers/coord_evController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    app.get('/coord_ev', isLoggedIn, coord_evController.index);

    app.get('/coord_ev/instrumentos', isLoggedIn, coord_evController.instrumentos);

    app.get('/coord_ev/factor', isLoggedIn, coord_evController.factor);

    app.post('/coord_ev/add-factor', isLoggedIn, coord_evController.addFactor);

    app.get('/coord_ev/instrument', isLoggedIn, coord_evController.instrument);

    app.get('/coord_ev/add-instrument', isLoggedIn, coord_evController.addInstrument);

    app.post('/coord_ev/add-instrument', isLoggedIn, coord_evController.createInstrument);

    app.get('/coord_ev/instrument/:id', isLoggedIn, coord_evController.verInstrument);

    app.post('/coord_ev/instrument/:id/add-item', isLoggedIn, coord_evController.addItem);

    app.get('/coord_ev/eventos', isLoggedIn, coord_evController.getEventos);

    app.get('/eventosTodos', coord_evController.eventTodos);

    app.post('/coord_ev/enviarEvento', isLoggedIn, coord_evController.enviarEvento);

    app.get('/coord_ev/getEventos', isLoggedIn, coord_evController.verEventos);

    app.get('/coord_ev/deleteEvento/:id', isLoggedIn, coord_evController.deleteEvento);

    app.get('/coord_ev/editEvento/:id', isLoggedIn, coord_evController.editEvento);

    app.post('/coord_ev/updateEvento/:id', isLoggedIn, coord_evController.updateEvento);

    app.get('/logout',authController.logout);

	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}