var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
	var fecha_actual = new Date();
	var usuario = req.user;

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
			where: {
				[Op.and]: {
					fecha_i: {
						[Op.lte]: fecha_actual
					},
					fecha_f: {
						[Op.gt]: fecha_actual
					}	
				}
			}
		}).then(evaluacion => {
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
					usuario 
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
	var instrumentFactor = false;
	var usuario = req.user;

	models.evaluacion.findOne({
		where: { id: req.params.id },
		include: [models.instrument, models.nucleo, models.unidad]
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
					models.usuario.findAll({
						where: { 
							[Op.and]: [
								{nucleoCodigo: Evaluacion.nucleoCodigo}, 
								{unidadCodigo: Evaluacion.unidadCodigo}
							] 
						}
					}).then(Empleado => {
						var Observacion = [];
						//res.send(Observacion);
						res.render('president/detalles/index', { 
							dataEvaluacion, 
							evalJefe, 
							Evaluacion, 
							usuario,
							Empleado,
							Observacion,
							instrumentFactor 
						});
					});
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
						models.usuario.findAll({
							where: { 
								[Op.and]: [
									{nucleoCodigo: Evaluacion.nucleoCodigo}, 
									{unidadCodigo: Evaluacion.unidadCodigo}
								] 
							}
						}).then(Empleado => {
							models.itemUsuario.findAll({
								include: [ models.item ],
								where: { evaluacionId: req.params.id }
							}).then(itemUsuario => {
								models.observacion.findAll({
									where: {
										evaluacionId: req.params.id
									}
								}).then(Observacion => {
									//res.send(Observacion);
									//console.log(typeof(Observacion));
									res.render('president/detalles/index', { 
										dataEvaluacion, 
										evalJefe, 
										Evaluacion, 
										instrumentFactor,
										Empleado,
										usuario,
										Usuario,
										Observacion,
										itemUsuario
									});
								})
							})
						});
					});
				});
			});
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
				}).then(usuario => {
					res.render('president/detalles/index_2', { evalUsuario, Usuario });
				})
			})
		} else if(Evaluacion.instrument.tipoEvalId == 1) {
			console.log('===========Auto-Evaluación=============');
			var instrumentFactor = false;
			models.evaluacionUsuario.findAll({
				include: [ models.evaluacion ],
				where: { evaluacionId: req.params.id }
			}).then(dataEvaluacion => {
				models.usuario.findAll({
					where: {
						[Op.and]: [
							{ nucleoCodigo: dataEvaluacion[0].evaluacion.nucleoCodigo },
							{ unidadCodigo: dataEvaluacion[0].evaluacion.unidadCodigo }
						]
					}
				}).then(Empleado => {
					//res.send(Usuario);
					res.render('president/detalles/index', { dataEvaluacion, Empleado, Evaluacion, usuario, instrumentFactor });
				});
			});
		}
	})	
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
						{evaluador: req.params.idue}
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
									Empleado
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