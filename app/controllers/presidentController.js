var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
	var fecha_actual = new Date();

	models.usuario.findOne({
		where: { 
			[Op.and]: [
					{nucleoCodigo:1}, 
					{unidadCodigo:12},
					{rolId:2}
				] 
		}
	}).then(presidente => {
		models.evaluacion.findAll({
			include: [models.nucleo, models.unidad],
		}).then(evaluacion => {
			//res.send(presidente);
			res.render('president/index', { presidente, evaluacion, fecha_actual });	
		});	
	});
}

/*
exports.detalles = function(req, res) {
	models.evaluacion.findOne({
		where: { id: req.params.id },
		include: [models.instrument]
	}).then(Evaluacion => {
		models.evaluacionUsuario.findAll({
			where: { 
				evaluacionId:req.params.id 
			}
		}).then(usuario => {
			models.usuario.findAll({
				where: { 
					[Op.and]: [ 
						{nucleoCodigo: Evaluacion.nucleoCodigo}, 
						{unidadCodigo: Evaluacion.unidadCodigo}] 
				}
			}).then(Empleados => {
				res.send(Evaluacion);
				//res.render('president/detalles/index', { usuario, Empleados });	
			});	
		});
	})	
}
*/

exports.detalles = function(req, res) {
	models.evaluacion.findOne({
		where: { id: req.params.id },
		include: [models.instrument]
	}).then(Evaluacion => {
		if(Evaluacion.instrument.tipoEvalId == 3) {
			console.log('===========Evaluacion de Jefe para Subordinados=============');
			//res.send(Evaluacion);

			models.usuario.findAll({
				where: { 
					[Op.and]: [
						{nucleoCodigo: Evaluacion.nucleoCodigo}, 
						{unidadCodigo: Evaluacion.unidadCodigo},
						{rolId: 5},
						{cargoId: 3}
					] 
				}
			}).then(Usuario => {
				models.evaluacionUsuario.findAll({
					where: { evaluacionId: req.params.id }
				}).then(dataEvaluacion => {
					//res.send(evaluacionUsuario);
					res.render('president/detalles/index', { dataEvaluacion });
				})
			})
		}
	})	
}