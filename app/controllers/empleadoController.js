var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
	var User = req.user;

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: User.cedula
		}
	}).then(Usuario => {
		models.instrument.findOne({
			where: { tipoEvalId: 1 }
		}).then(Instrument => {
			models.evaluacion.findOne({
				where: { instrumentId: Instrument.id }
			}).then(Eval => {
				models.evaluacionUsuario.findOne({
					where: {
						[Op.and]: [
							{usuarioCedula: User.cedula},
							{usuarioEvaluado: User.cedula}, 
							{evaluacionId: Eval.id}
						]
					} 
				}).then(dataEval => {
					models.evaluacionUsuario.findOne({
						where: {
							[Op.and]: [
								{usuarioCedula: User.cedula},
								{usuarioEvaluado: User.cedula}, 
								{evaluacionId: Eval.id},
								{status: false}	
							]
						}
					}).then(autoEval => {
						res.render('empleado/evaluacion/autoEval', { Usuario, dataEval, autoEval });
					});
				})
			})	
		})
		
		
		
	});
}

exports.verCoEval = function(req, res) {
	var User = req.user;
	var id = req.params.id;

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: User.cedula
		}
	}).then(Usuario => {
		models.evaluacionUsuario.findOne({
			where: {
				[Op.and]: [
					{usuarioCedula: User.cedula}, 
					{evaluacionId: req.params.id}	
				]
			}
		}).then(dataEval => {
			models.evaluacionUsuario.findAll({
				where: {
					[Op.and]: [
						{usuarioCedula: User.cedula}, 
						{evaluacionId: req.params.id},
						{status: false}
					]
				}
			}).then(coEval => {
				models.usuario.findAll({
					where: {
						[Op.and]: [
							{nucleoCodigo: Usuario.nucleoCodigo}, 
							{unidadCodigo: Usuario.unidadCodigo},
							{rolId: 5}
						]
					}
				}).then(Empleado => {
					res.render('empleado/evaluacion/coEval', { Usuario, dataEval, coEval, Empleado, id });	
				});
			});
		});
	});
}

exports.verEvalAJefe = function(req, res) {
	var User = req.user;
	var id = parseInt(req.params.id);

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: User.cedula
		}
	}).then(Usuario => {
		models.evaluacionUsuario.findOne({
			where: {
				[Op.and]: [
					{usuarioCedula: User.cedula}, 
					{evaluacionId: req.params.id},
					{status: false}	
				]
			}
		}).then(evalAJefe => {
			res.render('empleado/evaluacion/evalAJefe', { Usuario, evalAJefe, id });
		})
	})
}

exports.verEvalaSubor = function(req, res) {
	var User = req.user;

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: User.cedula
		}
	}).then(Usuario => {
		models.evaluacionUsuario.findOne({
			where: {
				[Op.and]: [
					{usuarioCedula: User.cedula}, 
					{evaluacionId: req.params.id}
				]
			}
		}).then(Eval => {
			models.evaluacionUsuario.findAll({
				where: {
					[Op.and]: [
						{usuarioCedula: User.cedula}, 
						{evaluacionId: req.params.id},
						{status: false}
					]
				}
			}).then(evalASubord => {
				models.usuario.findAll({
					where: {
						[Op.and]: [
							{nucleoCodigo: Usuario.nucleoCodigo}, 
							{unidadCodigo: Usuario.unidadCodigo},
							{rolId: 5}
						]
					}
				}).then(Empleado => {
					//res.send(Eval);
					res.render('empleado/evaluacion/evalASubord', { Usuario, Eval, evalASubord, Empleado });
				})
			});
		})
	});
}

/*HACIENDO PRUEBA*/
exports.prueba = function(req, res) {
	var User = req.user;

	/*Buscamos los datos del usuario q tiene la sesion activa (Evaluador)*/
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: User.cedula }
	}).then(Evaluador => {
		/*busca una evaluacion que tenga como id el id que viene por parametro */
		models.evaluacion.findOne({
			include: [models.instrument, models.nucleo, models.unidad],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			/*
				busca todos los factores que estan relacionados con el instrumento que a su ves esta relacionado 
				a la evaluacion encontrada anteriormente
			*/
			models.instrumentFactor.findAll({
				include: [models.factor],
				where: { instrumentId: Evaluacion.instrumentId }
			}).then(Factor => {
				/*
					busca todos los items que estan relacionados con el instrumento que a su ves esta relacionado
					con esta evaluacion
				*/
				models.item.findAll({
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Item => {
					/*
						Buscando los datos de la evaluacion donde el evaluador evalua a la cedula que viene por parametro
					*/
					models.evaluacionUsuario.findOne({
						where: { 
							[Op.and]: [
								{usuarioCedula: Evaluador.cedula}, 
								{evaluacionId:req.params.id},
								{usuarioEvaluado:req.params.idu}
							]  
						}
					}).then(Usuario => {
						/* Buscamos los datos del Evaluado */
						models.usuario.findOne({
							include: [ models.nucleo, models.unidad ],
							where: { cedula: Usuario.usuarioEvaluado }
						}).then(Evaluado => {
							if (Evaluador.nucleoCodigo == Evaluacion.nucleoCodigo && Evaluador.unidadCodigo == Evaluacion.unidadCodigo) {
								//res.send(evaluacionUsuario);
								res.render('empleado/evaluacion/examen/prueba', { 
									Evaluador,
									Evaluado, 
									Evaluacion, 
									Factor, 
									Item
								});
							} else{
								res.send('Negativo');
							}
						})
					})	
				})
				
			})	
		})
	});
}

exports.procesarPrueba = function(req, res) {
	console.log('=================Procesando Evaluacion===================');
	var item = [];
	var acomulado = 0;
	var calificacionFinal = 0;
	console.log('========Buscando Items==========');
	models.item.findAll({
		where: { instrumentId: req.body.instrumentId }
	}).then(Items => {
		for(let i = 0; i < Items.length; i ++) {
			item[i] = parseInt(req.body.item[i]); 
			acomulado = acomulado + item[i];
			console.log(Items[i].nombre+': '+item[i]);

			models.itemUsuario.create({
				calificacion: item[i],
				evaluacionId: req.params.id,
				itemId: Items[i].id,
				evaluado: req.params.idu,
				evaluador: req.body.Evaluador
			}).then(itemUsuario => {
				console.log('====Respuesta Almacenada=====');
			})
		}

		calificacionFinal = (acomulado / Items.length).toFixed(2);
		console.log('Calificacion Final: '+calificacionFinal);

		models.evaluacionUsuario.update({
			calificacion: calificacionFinal,
			status: true
		}, {
			where: {
				usuarioEvaluado: req.params.idu,
				evaluacionId: req.params.id,
				usuarioCedula: req.body.Evaluador
			}
		}).then(evaluacionUsuario => {
			console.log('Calificacion final Almacenada Exitosamente');
		});
		req.flash('info', 'Gracias por su tiempo, Sus respuestas se han enviado Exitosamente!');
		res.redirect('/dashboard');
	});
}
/*FIN DE PRUEBA*/

/*
exports.evaluacion = function(req, res) {
	var user = req.user;
	//busca un usuario que tenga como cedula el id que viene por parametro
	models.usuario.findById(req.params.idu).then(Usuario => {
		//busca una evaluacion que tenga como id el id que viene por parametro 
		models.evaluacion.findOne({
			include: [models.instrument, models.nucleo, models.unidad],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			/*
				busca todos los factores que estan relacionados con el instrumento que a su ves esta relacionado 
				a la evaluacion encontrada anteriormente
			
			models.instrumentFactor.findAll({
				include: [models.factor],
				where: { instrumentId: Evaluacion.instrumentId }
			}).then(instrumentFactor => {
				/*
					busca todos los items que estan relacionados con el instrumento que a su ves esta relacionado
					con esta evaluacion
				
				models.item.findAll({
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Items => {
					
					models.evaluacionUsuario.findOne({
						where: { 
								[Op.and]: [
									{usuarioCedula: req.params.idu}, 
									{evaluacionId:req.params.id},
									{usuarioEvaluado:req.params.idue}
								] 
							}
					}).then(evaluacionUsuario => {
						models.usuario.findAll({

						}).then(usuariosTodos => {
							if (Usuario.nucleoCodigo == Evaluacion.nucleoCodigo && Usuario.unidadCodigo == Evaluacion.unidadCodigo) {
								//res.send(evaluacionUsuario);
								res.render('empleado/evaluacion/examen/index', { 
									Usuario, 
									Evaluacion, 
									instrumentFactor, 
									Items,
									evaluacionUsuario,
									usuariosTodos,
									user
								});
							} else{
								res.send('Negativo');
							}	
						})
					})
				})
			})
		})
	})
}

exports.procesarEval = function(req, res) {
	console.log('=================Procesando Evaluacion===================');
	var item = [];
	var acomulado = 0;
	var calificacionFinal = 0;
	console.log('========Buscando Items==========');
	models.item.findAll({
		where: { instrumentId: req.body.instrumentId }
	}).then(Items => {
		for(let i = 0; i < Items.length; i ++) {
			item[i] = parseInt(req.body.item[i]); 
			acomulado = acomulado + item[i];
			console.log(Items[i].nombre+': '+item[i]);

			models.itemUsuario.create({
				calificacion: item[i],
				evaluacionId: req.params.id,
				itemId: Items[i].id,
				evaluado: req.params.idue,
				evaluador: req.params.idu
			}).then(itemUsuario => {
				console.log('====Respuesta Almacenada=====');
			})
		}

		calificacionFinal = (acomulado / Items.length).toFixed(2);
		console.log('Calificacion Final: '+calificacionFinal);

		models.evaluacionUsuario.update({
			calificacion: calificacionFinal,
			status: true
		}, {
			where: {
				usuarioEvaluado: req.params.idue,
				evaluacionId: req.params.id,
				usuarioCedula: req.params.idu
			}
		}).then(evaluacionUsuario => {
			console.log('Calificacion final Almacenada Exitosamente');
		});
		req.flash('info', 'Gracias por su tiempo, Sus respuestas se han enviado Exitosamente!');
		res.redirect('/dashboard');
	});
}
*/
exports.observaciones = function(req, res) {
	var user = req.user;

	models.observacion.findOne({
		where: {
			[Op.and]: [
				{id: req.params.id}, 
				{usuarioCedula: req.user.cedula},
			] 
		},
		include: [ models.evaluacion ]
	}).then(Observacion => {
		models.evaluacionUsuario.findOne({
			where: {
				[Op.and]: [
					{evaluacionId: Observacion.evaluacion.id}, 
					{usuarioEvaluado: req.user.cedula},
				]  
			},
			include: [ models.evaluacion ]
		}).then(evalUser => {
			models.itemUsuario.findAll({
				include: [ models.item ],
				where: {
					[Op.and]: [
						{evaluacionId: Observacion.evaluacion.id}, 
						{evaluado: req.user.cedula}
					]
				}
			}).then(itemUsuario => {
				models.instrumentFactor.findAll({
					where: { instrumentId: Observacion.evaluacion.instrumentId },
					include: [ models.factor ]
				}).then(Factores => {
					var acomulador = [];
					var calificacionFactor = [];

					for(let i = 0; i < Factores.length; i ++) {
						acomulador[i] = 0;
							
						var n = 0;
						console.log('================Nombre Factor: '+Factores[i].factor.nombre+'====================');
						for(let j = 0; j < itemUsuario.length; j ++) {
								
							if(itemUsuario[j].item.factorId == Factores[i].factorId) {
								n = n + 1;
								//console.log(Item[j].item.nombre);
								acomulador[i] = acomulador[i] + itemUsuario[j].calificacion;
								console.log('Acomulador'+[i]+': '+acomulador[i]);
							}
								
							calificacionFactor[i] = acomulador[i]/n;
						}
						console.log('calificacion factor '+Factores[i].factor.nombre+': '+calificacionFactor[i]);
						console.log('nro. de preguntas: '+n);
					}

					models.usuario.findOne({
						where: {
							[Op.and]: [
								{unidadCodigo: 12}, 
								{rolId: 2},
								{nucleoCodigo: 1}
							]
						}
					}).then(Presidente => {
						//res.send(Factores);
						res.render('empleado/observacion/index', { 
							Observacion,
							evalUser,
							Factores,
							calificacionFactor,
							user,
							Presidente
						});
					})
				})
			})
		})
	})
}

exports.comparacion = function(req, res) {
	models.evaluacionUsuario.findAll({
		where: {
			[Op.and]: [
				{status: true}, 
				{usuarioEvaluado: req.user.cedula},
			]
		},
		include: [ models.evaluacion ]
	}).then(evalUser => {
		//res.send(evalUser);
		res.render('empleado/comparacion/index', { evalUser });	
	});
}

exports.comparar = function(req, res) {
	models.itemUsuario.findAll({
		where: {
			[Op.and]: [
				{evaluacionId: req.body.evalA}, 
				{evaluado: req.user.cedula},
			]
		},
		include: [ models.item ]
	}).then(respEvalA => {
		models.itemUsuario.findAll({
			where: {
				[Op.and]: [
					{evaluacionId: req.body.evalB}, 
					{evaluado: req.user.cedula},
				]
			},
			include: [ models.item ]
		}).then(respEvalB => {
			models.instrumentFactor.findAll({
				where: { instrumentId: respEvalA[0].item.instrumentId },
				include: [ models.factor ]
			}).then(Factores => {
				var acomulador = [];
				var calificacionFactor = [];

				for(let i = 0; i < Factores.length; i ++) {
					acomulador[i] = 0;
							
					var n = 0;
					console.log('================Nombre Factor: '+Factores[i].factor.nombre+'====================');
					for(let j = 0; j < respEvalA.length; j ++) {
								
						if(respEvalA[j].item.factorId == Factores[i].factorId) {
							n = n + 1;
							//console.log(Item[j].item.nombre);
							acomulador[i] = acomulador[i] + respEvalA[j].calificacion;
							console.log('Acomulador'+[i]+': '+acomulador[i]);
						}
								
						calificacionFactor[i] = acomulador[i]/n;
					}
					console.log('calificacion factor '+Factores[i].factor.nombre+': '+calificacionFactor[i]);
					console.log('nro. de preguntas: '+n);
				}

				//res.send(respEvalB);
				res.render('empleado/comparacion/comparar', { Factores, calificacionFactor });		
			})	
		})
	})
}

exports.evaluaciones = function(req, res) {
	var idEvaluacion = parseInt(req.params.id);

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		models.evaluacion.findOne({
			where: { id: req.params.id }
		}).then(dataEvaluacion => {
			
				models.usuario.findOne({
					where: {
						[Op.and]: [
							{unidadCodigo: Usuario.unidadCodigo}, 
							{cargoId: 2}
						]
					}
				}).then(Jefe => {
					res.render('empleado/evaluacion/evaluaciones', { Usuario, dataEvaluacion, Jefe });		
				})
				
		})
	})
}

//===============
exports.buscarAutoE = function(req, res) {
	models.evaluacionUsuario.findOne({
		where: {
			[Op.and]: [
				{usuarioCedula: req.params.cedula}, 
				{evaluacionId: req.params.id}
			]
		}
	}).then(autoEval => {
		res.json(autoEval)
	}).catch(err => {
		console.log(err)
	})
}

exports.buscarCoEvals = function(req, res) {
	models.evaluacionUsuario.findAll({
		include: [ models.usuario ],
		where: {
			[Op.and]: [
				{usuarioCedula: req.params.cedula}, 
				{evaluacionId: req.params.id}
			]
		}
	}).then(coEvals => {
		res.json(coEvals);
	}).catch(err => {
		console.log(err);
	})
}

exports.getUsuarios = function(req, res) {
	models.usuario.findAll({

	}).then(Usuarios => {
		res.json(Usuarios);
	}).catch(err => {
		console.log(err)
	})
}

exports.buscarEvalsaSubor = function(req, res) {
	models.evaluacionUsuario.findAll({
		include: [ models.usuario ],
		where: { evaluacionId: req.params.id }
	}).then(evalsaSubor => {
		res.json(evalsaSubor);
	}).catch(err => {
		console.log(err)
	})
}