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
			include: [models.nucleo, models.unidad, models.instrument],
		}).then(evaluacion => {
			//res.send(presidente);
			res.render('president/index', { presidente, evaluacion, fecha_actual });	
		});	
	});
}

exports.autoEval = function(req, res) {
	models.evaluacion.findAll({
		include: [ models.instrument, models.nucleo, models.unidad ]
	}).then(Evaluacion => {
		//res.send(Evaluacion);
		res.render('president/detalles/autoEval/index', { Evaluacion });
	});
}

exports.detalles = function(req, res) {
	var instrumentFactor = false;

	models.evaluacion.findOne({
		where: { id: req.params.id },
		include: [models.instrument]
	}).then(Evaluacion => {
		if(Evaluacion.instrument.tipoEvalId == 3) {
			console.log('===========Evaluacion de Jefe para Subordinados=============');
			var evalSubor = true;
			var evalJefe = false;
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
					res.render('president/detalles/index', { dataEvaluacion, evalJefe, Evaluacion, instrumentFactor });
				})
			})
		} else if(Evaluacion.instrument.tipoEvalId == 4) {
			console.log('===========Evaluacion de Subordinados para Jefes=============');
			//res.send(Evaluacion);
			var evalSubor = false;
			var evalJefe = true;

			models.usuario.findOne({
				where: { 
					[Op.and]: [
						{nucleoCodigo: Evaluacion.nucleoCodigo}, 
						{unidadCodigo: Evaluacion.unidadCodigo},
						{rolId: 5},
						{cargoId: 2}
					] 
				}
			}).then(Usuario => {
				models.evaluacionUsuario.findAll({
					include: [ models.evaluacion ],
					where: { evaluacionId: req.params.id }
				}).then(dataEvaluacion => {
					models.instrumentFactor.findAll({
						include: [models.factor],
						where: { instrumentId: Evaluacion.instrumentId }
					}).then(instrumentFactor => {
						//res.send(dataEvaluacion);
						res.render('president/detalles/index', { 
							dataEvaluacion, 
							evalJefe, 
							Evaluacion, 
							instrumentFactor 
						});	
					})
				})
			})
		} else if(Evaluacion.instrument.tipoEvalId == 2) {
			console.log('===========Evaluacion entre compañeros (Co-Evaluación)=============');
			//res.send(Evaluacion);
			models.evaluacionUsuario.findAll({
				include: [ models.evaluacion ],
				where: {
					[Op.and]: [
						{evaluacionId: req.params.id}
					]
				}
			}).then(evalUsuario => {
				models.usuario.findAll({
					where: {
						[Op.and]: [
							{ cargoId: 3 },
							{ rolId: 5 }
						]
					}
				}).then(Usuario => {
					res.render('president/detalles/index_2', { evalUsuario, Usuario });
				})
			})
		}
	})	
}

exports.culminado = function(req, res) {
	console.log('================Examen Culminado==================');

	models.evaluacion.findOne({
		include: [ models.instrument ],
		where: { id: req.params.id }
	}).then(Evaluacion => {
		models.instrumentFactor.findAll({
			include: [models.factor],
			where: { instrumentId: Evaluacion.instrumentId }
		}).then(instrumentFactor => {
			models.itemUsuario.findAll({
				include: [models.item],
				where: {
					[Op.and]: [
						{evaluado: req.params.idu}, 
						{evaluador: req.params.idue}
					]
				}
			}).then(Item => {

				models.evaluacionUsuario.findOne({
					where: {
						[Op.and]: [
							{usuarioEvaluado: req.params.idu}, 
							{evaluacionId: req.params.id},
							{usuarioCedula: req.params.idue},
							{status: true}
						]
					}
				}).then(dataEvaluacion => {
					

						var acomulador = [];
						var calificacionFactor = [];

						for(let i = 0; i < instrumentFactor.length; i ++) {
							acomulador[i] = 0;
							
							var n = 0;
							console.log('================Nombre Factor: '+instrumentFactor[i].factor.nombre+'====================');
							for(let j = 0; j < Item.length; j ++) {
								
								if(Item[j].item.factorId == instrumentFactor[i].factorId) {
									n = n + 1;
									//console.log(Item[j].item.nombre);
									acomulador[i] = acomulador[i] + Item[j].calificacion;
									console.log('Acomulador'+[i]+': '+acomulador[i]);
								}
								
								calificacionFactor[i] = acomulador[i]/n;
							}
							console.log('calificacion factor '+instrumentFactor[i].factor.nombre+': '+calificacionFactor[i]);
							console.log('nro. de preguntas: '+n);
						}
						
						if(Evaluacion.instrument.tipoEvalId == 3) {
							var observacion = true;
							//res.send(dataEvaluacion);
							res.render('president/detalles/culminado/index', { 
								Evaluacion, 
								instrumentFactor, 
								Item, 
								calificacionFactor,
								dataEvaluacion,
								observacion 
							});
						} else if(Evaluacion.instrument.tipoEvalId == 4) {
							observacion = false;
							//res.send(dataEvaluacion);
							res.render('president/detalles/culminado/index', { 
								Evaluacion, 
								instrumentFactor, 
								Item, 
								calificacionFactor,
								dataEvaluacion,
								observacion 
							});
						} else if(Evaluacion.instrument.tipoEvalId == 2) {
							observacion = false;
							//res.send(dataEvaluacion);
							res.render('president/detalles/culminado/index', { 
								Evaluacion, 
								instrumentFactor, 
								Item, 
								calificacionFactor,
								dataEvaluacion,
								observacion 
							});
						}	
				})	
			})		
		})
	})
}