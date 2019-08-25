var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
    var fechaActual = new Date();

    models.evaluacion.findAll({
        include: [ models.nucleo, models.unidad ],
        where: {
            [Op.or]: {
                fecha_i: {
                    [Op.gte]: fechaActual
                },
                fecha_f: {
                    [Op.gte]: fechaActual  
                }   
            },
            instrumentId: 2
        },
        limit: 1,
        order: [[ 'fecha_i', 'DESC' ]]
    }).then(Evaluaciones => {
        models.evento.findAll({
            limit: 4,
            order: [['id', 'DESC']]
        }).then(Eventos => {
            res.render('index/index', { Evaluaciones, Eventos });    
        })
    })
    
    //res.send('Ruta Index');
}

exports.etapas = function(req, res) {
    models.modulo.findOne({
        where: { id: 6 }
    }).then(Etapas => {
        res.render('index/conocenos/etapas/index', {
            Etapas
        });
    })
}

exports.objetivos = function(req, res) {
    models.modulo.findOne({
        where: { id: 4 }
    }).then(Objetivos => {
        res.render('index/conocenos/objetivos', { Objetivos });    
    });
}

exports.creacionMision = function(req, res) {
    models.modulo.findAll({
        order: [[ 'id', 'ASC' ]],
        where: {
            [Op.or]: [{id: 1}, {id: 2}, {id: 3}]
        }
    }).then(Data => {
        res.render('index/conocenos/creacion&mision', { Data });
    })
}

exports.funciones = function(req, res) {
    models.modulo.findOne({
        where: { id: 5 }
    }).then(Funciones => {
        res.render('index/conocenos/funciones', { Funciones });    
    });
}

exports.reglamentos = function(req, res) {
    res.render('index/conocenos/reglamentos');
}

exports.getEvento = function(req, res) {
    models.evento.findOne({
        where: { id: req.params.id }
    }).then(Evento => {
        res.json(Evento);
    }).catch(err => {
        res.json(err);
    });
}

exports.getEventoPrincipal = function(req, res) {
    models.evento.findOne({
        order: [
            ['id', 'DESC']
        ]
    }).then(Evento => {
        res.json(Evento);
    }).catch(err => {
        res.json(err);
    });
}