//================RUTAS Coordinador de Evaluación==================

var coord_evController = require('../../controllers/coord_evController.js');
var authController = require('../../controllers/authController.js');

module.exports = function(app) {

    //===========Ruta Principal Coord Evaluacion============
        app.get('/coord_ev', isLoggedIn, coord_evController.index);

    //===================Ruta Instrumentos de Evaluación =====================
        app.get('/coord_ev/instrumentos', isLoggedIn, coord_evController.instrumentos);

        //=======================Ver Instrumento Especifico(id)==============
            app.get('/coord_ev/verInstrumento/:id', isLoggedIn, coord_evController.verInstrumento);

            //=================Rutas axios Solicitando Informacion==========================
                //---------------------Obtener Datos Relevantes del Instrumento----------
                    app.get('/coord_ev/getInstrumento/:id', isLoggedIn, coord_evController.getInstrumento);

                //-----------------Obtener Todas las Categorias--------------------------------
                    app.get('/coord_ev/getCategorias', isLoggedIn, coord_evController.getCategorias);

                //----------------Obtener Todas las Preguntas (item y factor) relacionadas a un instrumento----------
                    app.get('/coord_ev/instrument/:id', isLoggedIn, coord_evController.verInstrument);

                //==================Obtener Factores================
                    app.get('/coord_ev/getFactores', isLoggedIn, coord_evController.getFactores);



            //================Rutas axios Edit Instrumento de Evaluacion=====================
                //---------------Creando Factores por medio de axios---------------------
                    app.post('/cord_ev/crearFactor/:id', isLoggedIn, coord_evController.crearFactor);

                //------------------Editar Cabezera de un Intrumento de Evaluacion-----------
                    app.post('/coord_ev/updateInstrumento/:id', isLoggedIn, coord_evController.updateInstrumento);


                //---------------Procesar Creación de Pregunta (Item + Factor)
                    app.post('/coord_ev/addPregunta/:id', isLoggedIn, coord_evController.addPregunta);

                //-------------Eliminando un Item------------------------
                    app.delete('/coord_ev/deleteItem/:id/factor/:factorId', isLoggedIn, coord_evController.deleteItem);

                //----------------Obtener Todos los Tipos de Evaluaciones---------------
                    app.get('/coord_ev/getTipos', isLoggedIn, coord_evController.getTipos);


/*---------------------Rutas activas pero no las estoy usando-----------------------------------------*/
    //===========================Ruta Crear Nuevo Instrumento (Formulario)======================
        app.get('/coord_ev/addInstrumento', isLoggedIn, coord_evController.agregarInstrumento);

        //=================Procesar Creación de Nuevo Instrumento=================
            app.post('/coord_ev/add-instrument', isLoggedIn, coord_evController.createInstrument);

            //2do paso para la creacion de un instrumento (creando Items y factores)=========
                app.get('/coord_ev/instrumento/:id', isLoggedIn, coord_evController.completarIntrumento);

            //===============Procesando Creación de un Factor =====================
                app.post('/coord_ev/addFactor', isLoggedIn, coord_evController.addFactor);
/*---------------------------------------------------------------------------------------------------------*/


    //Rutas axios
        //=================Solicitar todos los datos de un intrumento determinado(id)
            app.get('/coord_ev/instrum/:id', isLoggedIn, coord_evController.getPreguntas);

            app.post('/coord_ev/updatePregunta/:id', isLoggedIn, coord_evController.updatePregunta);

            

            

    //=======================Ver Instrumento Especifico(id)==============
    app.get('/coord_ev/verInstrumento/:id', isLoggedIn, coord_evController.verInstrumento);

    app.get('/coord_ev/editIntrumento/:id', isLoggedIn, coord_evController.editInstrumento);
    //========================================


    app.get('/coord_ev/factor', isLoggedIn, coord_evController.factor);

    app.post('/coord_ev/add-factor', isLoggedIn, coord_evController.addFactor);

    app.get('/coord_ev/instrument', isLoggedIn, coord_evController.instrument);

    app.get('/coord_ev/add-instrument', isLoggedIn, coord_evController.addInstrument);


    

    app.post('/coord_ev/instrument/:id/add-item', isLoggedIn, coord_evController.addItem);


    /*========================Eventos=======================*/
        app.get('/coord_ev/eventos', isLoggedIn, coord_evController.verEventos);

        app.get('/coord_ev/eventos/planificar', isLoggedIn, coord_evController.planificarEvento);

        app.post('/coord_ev/enviarEvento', isLoggedIn, coord_evController.enviarEvento);

    //app.get('/coord_ev/eventos', isLoggedIn, coord_evController.getEventos);

    app.get('/eventosTodos', coord_evController.eventTodos);

    

    

    app.get('/coord_ev/eventos/planificar', isLoggedIn, coord_evController.verEventos);

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