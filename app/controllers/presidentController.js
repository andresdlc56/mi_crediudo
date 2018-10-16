var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
	//obtener fecha actual
	var fecha_actual = new Date();
	
	//obtener datos del usuario q inicio sesion
	var usuario = req.user;

	/*
		buscar un usuario que pertenesca al nucleo "Rectorado", 
		a la unidad "CREDIUDO" y tenga un rol "Presidente"
	*/
	models.usuario.findOne({
		where: { 
			[Op.and]: [
				{nucleoCodigo:1}, 
				{unidadCodigo:12},
				{rolId:2}
			]
		}
	}).then(presidente => {
		/*
			Buscar todas la evaluaciones donde la fecha Inicio >= fecha actual y fecha Final > fecha actual
		*/
		models.evaluacion.findAll({
			include: [models.nucleo, models.unidad, models.instrument],
			where: {
				[Op.and]: {
					fecha_i: {
						[Op.lte]: fecha_actual
					},
					fecha_f: {
						[Op.gt]: fecha_actual
					},
					instrumentId: 4	
				}
			}
		}).then(evaluacion => {
			/*
				Buscar todas las Evaluaciones donde la fecha final sea menor a la fecha actual
			*/
			models.evaluacion.findAll({
				include: [models.nucleo, models.unidad, models.instrument],
				where: {
					fecha_f: {
						[Op.lt]: fecha_actual
					}
				}
			}).then(evalCulminada => {
				//res.send(presidente);
				res.render('president/index', { 
					presidente, 
					evaluacion,
					evalCulminada, 
					fecha_actual, 
					usuario,
					message: req.flash('info')
				});	
			})	
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
	var usuario = req.user;

	models.evaluacion.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { id: req.params.id }
	}).then(infoEval => {
		models.evaluacionUsuario.findAll({
			include: [models.evaluacion],
			where: {
				evaluacionId: req.params.id  
			}
		}).then(autoEval => {
			models.evaluacionUsuario.findAll({
				include: [models.evaluacion],
				where: {
					evaluacionId: parseInt(req.params.id) + 1		
				}
			}).then(coEval => {
				models.evaluacionUsuario.findAll({
					include: [models.evaluacion],
					where: {
						evaluacionId: parseInt(req.params.id) + 3		
					}
				}).then(evalSubor => {
					models.evaluacionUsuario.findAll({
						include: [models.evaluacion],
						where: {
							evaluacionId: parseInt(req.params.id) + 2		
						}	
					}).then(evalJefe => {
						res.render('president/detalles/index', { 
							usuario, 
							infoEval, 
							autoEval, 
							coEval,
							evalSubor,
							evalJefe
						});
					});
				});
			});	
		});
	});
}

exports.verAutoEval = function(req, res) {
	res.render('president/detalles/autoEval/index');
}

exports.culminado = function(req, res) {
	/*Datos del Usuario Logeado*/
	var usuario = req.user;

	console.log('================Examen Culminado==================');
	/*Buscar la Evaluación con el ID que viene por parametro*/
	models.evaluacion.findOne({
		include: [ models.instrument ],
		where: { id: req.params.id }
	}).then(Evaluacion => {
		/*Buscar todos los Factores que usa el instrumento de eval usado en esta evaluacion*/
		models.instrumentFactor.findAll({
			include: [models.factor],
			where: { instrumentId: Evaluacion.instrumentId }
		}).then(instrumentFactor => {
			/*Buscar todos los items respondido por el usuario que viene por parametro*/
			models.itemUsuario.findAll({
				include: [models.item],
				where: {
					[Op.and]: [
						{evaluado: req.params.idu}, 
						{evaluador: req.params.idue},
						{evaluacionId: req.params.id}
					]
				}
			}).then(Item => {
				/*Buscar una Evaluacion ligada a un usuario que viene identificado por parametro y su status sea true*/
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
					/*Buscar todos los Usuarios*/
					models.usuario.findAll({

					}).then(Empleado => {
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
							models.observacion.findAll({
								where: {
									usuarioCedula: req.params.idu,
									evaluacionId: req.params.id
								}
							}).then(Observacion => {
								//res.send(Observacion);
								res.render('president/detalles/culminado/index', { 
									Evaluacion, 
									instrumentFactor, 
									Item, 
									calificacionFactor,
									dataEvaluacion,
									observacion,
									Observacion,
									usuario,
									Empleado,
									message: req.flash('info')
								});
							})
						} else if(Evaluacion.instrument.tipoEvalId == 4) {
							observacion = false;
							//res.send(dataEvaluacion);
							res.render('president/detalles/culminado/index', { 
								Evaluacion, 
								instrumentFactor, 
								Item, 
								calificacionFactor,
								dataEvaluacion,
								observacion,
								usuario,
								Empleado
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
								observacion,
								usuario,
								Empleado 
							});
						} else if(Evaluacion.instrument.tipoEvalId == 1) {
							observacion = false;
							//res.send(dataEvaluacion);
							res.render('president/detalles/culminado/index', { 
								Evaluacion, 
								instrumentFactor, 
								Item, 
								calificacionFactor,
								dataEvaluacion,
								observacion,
								usuario,
								Empleado 
							});
						}
					});			
				});	
			});		
		});
	});
}

exports.observacion = function(req, res) {
	console.log('====================creando observacion===============');
	models.observacion.create({
		contenido: req.body.observacion,
		evaluacionId: req.params.id,
		usuarioCedula: req.body.cedula
	}).then(Observacion => {
		req.flash('info', 'Observacion Creada Exitosamente!');
		res.redirect('/president');
	});
}

exports.historial = function(req, res) {
	var usuario = req.user;

	models.evaluacion.findAll({
		include: [models.nucleo, models.unidad]

	}).then(Evaluaciones => {
		//res.send(Evaluaciones);
		res.render('president/historial/index', { usuario, Evaluaciones });		
	});
}

exports.editObserv = function(req, res) {
	models.observacion.update({
		contenido: req.body.observacion
	}, {
		where: { 
			usuarioCedula: req.body.cedula,
			evaluacionId: req.params.id
		}
	}).then(Observacion => {
		req.flash('info', 'Observacion Actualizada!');
		res.redirect('/president/detalles/'+req.params.id);
	})
}