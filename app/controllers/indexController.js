var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
    models.evaluacion.findAll({

    }).then(Evaluaciones => {
    	models.noticia.findAll({
    		limit: 4,
			order: [['id', 'DESC']] 
    	}).then(Noticias => {
    		res.render('index/index', { Evaluaciones, Noticias });
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