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
			},
			order: [
				['fecha_i', 'ASC']
			]
		}).then(evaluacion => {
			/*
				Buscar todas las Evaluaciones donde la fecha final sea menor a la fecha actual
			*/
			models.evaluacion.findAll({
				include: [models.nucleo, models.unidad, models.instrument],
				where: {
					[Op.and]: {
						fecha_f: {
							[Op.lt]: fecha_actual
						},
						instrumentId: 4	
					}
				}
			}).then(evalCulminada => {
				models.usuario.findOne({
					where: { rolId: 3 }
				}).then(coordPlani => {
					models.usuario.findOne({
						where: { rolId: 4 }
					}).then(coordEval => {
						models.usuario.findOne({
							where: { rolId: 2 }
						}).then(president => {
							models.evaluacion.findAll({
								include: [models.nucleo, models.unidad, models.instrument],
								where: {
									[Op.and]: {
										fecha_i: {
											[Op.gt]: fecha_actual
										},
										fecha_f: {
											[Op.gt]: fecha_actual
										},
										instrumentId: 4	
									}
								},
								order: [
									['fecha_i', 'ASC']
								]
							}).then(proxiEval => {
								/*
									Buscar todas las evaluaciones Planificadas donde el instrumento usuado sea 4
								*/
								models.evaluacion.findAll({
									where: { instrumentId: 4 }
								}).then(allEval => {
									models.nucleo.findAll({

									}).then(Nucleo => {
										//res.send(evaluacion);
										res.render('president/index', { 
											presidente, 
											evaluacion,
											evalCulminada, 
											fecha_actual, 
											usuario,
											coordPlani,
											coordEval,
											president,
											proxiEval,
											allEval,
											Nucleo,
											message: req.flash('info')
										});
									});
								});
							});
						});
					});	
				});
			});	
		});	
	});
}

/*================ver Evaluaciones Planificadas================*/
exports.evalPlanificadas = function(req, res) {
	var user = req.user;
	var fechaActual = new Date();

	/*Buscar Usuario Logueado*/
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: user.cedula }
	}).then(Usuario => {
		/*Buscar todas las evaluaciones planificadas donde usen el intrumento 4*/
		models.evaluacion.findAll({
			include: [ models.nucleo, models.unidad ],
			where: { instrumentId: 4 }
		}).then(evalPlanificada => {
			res.render('president/evaluaciones/planificadas/index', { Usuario, evalPlanificada, fechaActual });
		});
	});
}

/*================ver Evaluaciones en Proceso================*/
exports.evalProceso = function(req, res) {
	var user = req.user;
	var fechaActual = new Date();

	/*Buscar Usuario Logueado*/
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: user.cedula }
	}).then(Usuario => {
		/*
			Buscar todas las evaluaciones planificadas donde usen el intrumento 4, 
			su fecha de fecha de inicio sea menor o igual a fecha actual y
			su fecha final sea mayor a la fecha actual 
		*/
		models.evaluacion.findAll({
			include: [ models.nucleo, models.unidad ],
			where: {
				[Op.and]: {
					fecha_i: {
						[Op.lte]: fechaActual
					},
					fecha_f: {
						[Op.gt]: fechaActual
					},
					instrumentId: 1	
				}
			}
		}).then(evalProceso => {
			res.render('president/evaluaciones/enProceso/index', { Usuario, evalProceso });
		});
	});
}

/*===================Ver Evaluaciones Culminadas=======================*/
exports.evalCulmi = function(req, res) {
	var user = req.user;
	var fechaActual = new Date();

	/*Buscar Usuario Logueado*/
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: user.cedula }
	}).then(Usuario => {
		/*
			Buscar todas las evaluaciones planificadas donde usen el intrumento 4, 
			su fecha de fecha de inicio sea menor o igual a fecha actual y
			su fecha final sea menor a la fecha actual 
		*/
		models.evaluacion.findAll({
			include: [ models.nucleo, models.unidad ],
			where: {
				[Op.and]: {
					fecha_i: {
						[Op.lte]: fechaActual
					},
					fecha_f: {
						[Op.lt]: fechaActual
					},
					instrumentId: 4	
				}
			}
		}).then(evalCulmi => {
			res.render('president/evaluaciones/culminadas/index', { Usuario, evalCulmi });
		});
	});
}

/*===============Ver Nucleos=======================*/
exports.nucleos = function(req, res) {
	var user = req.user;

	/*Buscar Usuario logueado*/
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: user.cedula }
	}).then(Usuario => {
		/*Buscar todos los Nucleos*/
		models.nucleo.findAll({
			order: [
				['codigo', 'ASC']
			]
		}).then(Nucleo => {
			models.unidad.findAll({

			}).then(Unidad => {
				res.render('president/nucleos/index', { Usuario, Nucleo, Unidad });	
			});
		});
	});
}

/*===============Ver Unidades=======================*/
exports.unidades = function(req, res) {
	var user = req.user;

	/*Buscar Usuario logueado*/
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: user.cedula }
	}).then(Usuario => {
		/*Buscar el Nucleo que viene por parametro*/
		models.nucleo.findOne({
			where: { codigo: req.params.id }
		}).then(Nucleo => {
			/*Buscar todas las Unidades pertenecientes al nucleo que viene por parametro*/
			models.unidad.findAll({
				where: { nucleoCodigo: req.params.id }
			}).then(Unidad => {
				/*Buscar todas las Evaluaciones que se le han hecho a dicho nucleo*/
				models.evaluacion.findAll({
					where: { 
						[Op.and]: [
							{ nucleoCodigo: req.params.id },
							{ instrumentId: 4 } 
						]
					}
				}).then(Evaluacion => {
					res.render('president/unidades/index', { Usuario, Nucleo, Unidad, Evaluacion });	
				})
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

/* Controlador para ver los detalles de una Evalucacion */
exports.detalles = function(req, res) {
	var usuario = req.user; //Datos del Usuario que inicio sesion
	var idB = parseInt(req.params.id) + 1;
	var idC = parseInt(req.params.id) + 2;
	var idD = parseInt(req.params.id) + 3;
	/*
		Buscar los datos de la evaluacion que viene por parametro
	*/
	models.evaluacion.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { id: req.params.id }
	}).then(infoEval => {
		/*
			Buscar toda info de la evaluacionUsuario donde evaluacionId
			es igual al id que viene por parametro 
		*/
		models.evaluacionUsuario.findAll({
			include: [models.evaluacion],
			where: {
				evaluacionId: req.params.id
			}
		}).then(autoEval => {
			models.evaluacionUsuario.findAll({
				include: [models.evaluacion],
				where: {
					evaluacionId: idB		
				}
			}).then(coEval => {
				//Evaluacion que realizan los jefes para calificar al subordinado
				models.evaluacionUsuario.findAll({
					include: [models.evaluacion],
					where: {
						evaluacionId: idD		
					}
				}).then(evalSubor => {
					//Evaluacion que realizan los subordinados para calificar al Jefe
					models.evaluacionUsuario.findAll({
						include: [models.evaluacion],
						where: {
							evaluacionId: idC		
						}	
					}).then(evalJefe => {
						models.usuario.findAll({
							where: {
								nucleoCodigo: infoEval.nucleoCodigo,
								unidadCodigo: infoEval.unidadCodigo
							}
						}).then(dataUser => {
							models.evaluacionUsuario.findAll({
								where: {
									[Op.and]: [
										{status: true},
										{
											[Op.or]: [{evaluacionId: req.params.id}, {evaluacionId: idB}, {evaluacionId: idC}, {evaluacionId: idD}]
										} 
									]
								}
							}).then(evalTrue => {
								var evalTotal = autoEval.length + coEval.length + evalSubor.length + evalJefe.length;
								var evalListas = evalTrue.length;

								console.log("Total de Evaluaciones: "+ evalTotal);
								console.log("Evaluaciones ya Ejecutadas: "+ evalListas);

								models.observacion.findAll({
									where: { evaluacionId: req.params.id }
								}).then(Calificacion => {
									var acomulado = 0;

									for(let i = 0; i < Calificacion.length; i ++) {
										acomulado = acomulado + parseFloat(Calificacion[i].calificacion);
									}

									models.calificacion.findOne({
										where: {evaluacionId: req.params.id}
									}).then(califiUni => {
										//res.send(dataUser);
										res.render('president/detalles/index', { 
											usuario, 
											infoEval, 
											autoEval, 
											coEval,
											evalSubor,
											evalJefe,
											dataUser,
											evalTotal,
											evalListas, 
											Calificacion,
											acomulado,
											califiUni
										});
									})
								})	
							});
						});
					});
				});
			});	
		});
	});
}

exports.verPersonal = function(req, res) {
	var usuario = req.user;

	models.evaluacion.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { id: req.params.id }
	}).then(infoEval => {
		models.usuario.findAll({
			include: [ models.cargo ],
			where: {
				[Op.and]: [
					{nucleoCodigo: infoEval.nucleoCodigo}, 
					{unidadCodigo: infoEval.unidadCodigo}
				]
			}
		}).then(miembro => {
			res.render('president/detalles/personal/index', { usuario, infoEval, miembro });
		})
	})
}

exports.verCalificacion = function(req, res) {
	var usuario = req.user; //info del usuario que inicio sesion

	var idB = parseInt(req.params.id)+1;//id q representa la coevaluacion
	var idC = parseInt(req.params.id)+2;//id q representa evaluacion al jefe
	var idD = parseInt(req.params.id)+3;//id q representa evaluacion al subordinado

	/*
		Buscar la informacion de la evaluacion que viene por parametro
	*/
	models.evaluacion.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { id: req.params.id }
	}).then(infoEval => {
		/*
			Buscar informacion del usuario seleccionado donde su
			cedula sea igual a la cedula que viene por parametro y pertencesca
			a la unidad donde se esta realizando la evaluacion encontrada en el paso anterior 
		*/
		models.usuario.findOne({
			include: [ models.nucleo, models.unidad, models.cargo ],
			where: {
				[Op.and]: [
					{cedula: req.params.idUser}, 
					{unidadCodigo: infoEval.unidadCodigo},
				]
			}
		}).then(User => {
			/*Si el usuario encontrado tiene cargo 3 (subordinado)*/
			if(User.cargoId == 3) {
				/*
					Buscar la autoEvaluacion realizada por el usuario encontrado 
					en el paso anterior 
				*/
				models.evaluacionUsuario.findOne({
					where: {
						[Op.and]: [
							{usuarioCedula: User.cedula},
							{usuarioEvaluado: User.cedula}, 
							{evaluacionId: parseInt(req.params.id)},
							{status: true}
						]
					}
				}).then(autoEval => {
					/*
						Buscar todas la coEvaluaciones realizadas por los compañeros 
						del usuario seleccionado
					*/
					models.evaluacionUsuario.findAll({
						where: {
							[Op.and]: [
								{usuarioEvaluado: User.cedula}, 
								{evaluacionId: idB},
								{status: true}
							]		
						}
					}).then(coEval => {
						/*Si el Usuario Seleccionado ha sido coEvaluado 3 veces*/
						if(coEval.length == 3) {
							var calificacion = 0;
							let acomulado = 0;

							for(let i = 0; i < coEval.length; i ++) {
								acomulado = acomulado + parseFloat(coEval[i].calificacion);
							}
							calificacion = acomulado / 3;

							/*Buscar la Evaluacion donde el Jefe de usuario seleccionado lo Evaluao*/
							models.evaluacionUsuario.findOne({
								where: {
									[Op.and]: [
										{usuarioEvaluado: User.cedula}, 
										{evaluacionId: idD},
										{status: true}
									]
								}
							}).then(evaldJefe => {
								var califiGeneral = 0;
								var acomuladoAutoeval = 0;
								var acomuladoCoeval = 0;
								var acomuladoJefe = 0;

								acomuladoAutoeval = (autoEval.calificacion * 2) / 10;
								acomuladoJefe = (evaldJefe.calificacion * 3) / 10;
								acomuladoCoeval = (calificacion * 5) / 10;
								califiGeneral = acomuladoAutoeval + acomuladoCoeval + acomuladoJefe;

								models.observacion.findOne({
									where: {
										[Op.and]: [
											{usuarioCedula: User.cedula}, 
											{evaluacionId: req.params.id}
										] 
									}
								}).then(Observacion => {
									console.log('====info evaluacion=======');
									console.log('Usuario Seleccionado: '+User.nombre+' '+User.apellido);
									console.log('Calificacion AutoEval: '+autoEval.calificacion);
									console.log('Nro de veces que ha sido evaluado por un compañero: '+coEval.length);
									console.log('Calificacion coEval: '+calificacion);
									console.log('Calificacion segun Jefe: '+evaldJefe.calificacion);
									console.log('Calificacion segun General: '+califiGeneral);
									//res.send(Observacion);
									res.render('president/detalles/personal/calificacion', {
										usuario,
										infoEval,
										User,
										autoEval,
										calificacion,
										evaldJefe,
										califiGeneral,
										Observacion
									});
								})								

								
							});		
						} else {
							res.send('Aun no ha sido Evaluado 3 veces');
						}	
					});
				});
			} else if(User.cargoId == 2) {
				models.evaluacionUsuario.findOne({
					where: {
						[Op.and]: [
							{usuarioCedula: User.cedula},
							{usuarioEvaluado: User.cedula}, 
							{evaluacionId: parseInt(req.params.id)},
							{status: true}
						]
					}
				}).then(autoEval => {
					models.evaluacionUsuario.findAll({
						where: {
							[Op.and]: [
								{usuarioEvaluado: User.cedula}, 
								{evaluacionId: idC},
								{status: true}
							]
						}
					}).then(evalAlJefe => {
						/*Buscar todo el personal con cargo 3 (subordinado) de esta unidad*/
						models.usuario.findAll({
							where: {
								[Op.and]: [
									{nucleoCodigo: infoEval.nucleoCodigo}, 
									{unidadCodigo: infoEval.unidadCodigo},
									{cargoId: 3}
								]
							}
						}).then(Subordinado => {
							if(evalAlJefe.length == Subordinado.length) {
								var calificacion = 0;
								let acomulado = 0;

								var califiGeneral = 0;
								var acomuladoAutoeval = 0;
								var acomuladoSubor = 0;


								for(let i = 0; i < evalAlJefe.length; i ++) {
									acomulado = acomulado + parseFloat(evalAlJefe[i].calificacion);
								}
								calificacion = acomulado / evalAlJefe.length;

								acomuladoAutoeval = (autoEval.calificacion * 3)/10;
								acomuladoSubor = (calificacion * 7)/10;
								califiGeneral = acomuladoAutoeval + acomuladoSubor;

								models.observacion.findOne({
									where: {
										[Op.and]: [
											{usuarioCedula: User.cedula}, 
											{evaluacionId: req.params.id}
										] 
									}
								}).then(Observacion => {
									console.log('====info evaluacion=======');
									console.log('Usuario Seleccionado: '+User.nombre+' '+User.apellido);
									console.log('Calificacion AutoEval: '+autoEval.calificacion);
									console.log('Nro de veces que ha sido evaluado por un Subordinado: '+evalAlJefe.length);
									console.log('Calificacion segun subordinados: '+calificacion);
									res.render('president/detalles/personal/calificacion', { 
										usuario, 
										infoEval, 
										User,
										autoEval,
										evalAlJefe,
										Subordinado,
										calificacion,
										califiGeneral,
										Observacion
									});
								})
							} else {
								res.send(evalAlJefe);
							}
						});
					});
				});
			}
		});
	});
}

exports.calificar = function(req, res) {
	var calificacion = parseFloat(req.body.calificacion);
	calificacion = calificacion.toFixed(2);

	models.observacion.create({
		contenido: req.body.observacion,
		calificacion: calificacion,
		evaluacionId: req.params.id,
		usuarioCedula: req.params.idUser
	}).then(Observacion => {
		res.redirect('/president/detalles/'+ req.params.id +'/personal');
	});
}

exports.verAutoEval = function(req, res) {
	var user = req.user;

	//Datos del Evaluado
	models.usuario.findOne({
		include: [models.nucleo, models.unidad],
		where: { cedula: req.params.idUser }
	}).then(Evaluado => {
		//Datos de la Evaluacion
		models.evaluacion.findOne({
			include: [ models.instrument ],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			/*
				Datos de los factores pertenecientes al instrumento 
				usado en la evaluacion que encontramos en paso anterior 
			*/
			models.instrumentFactor.findAll({
				include: [ models.factor ],
				where: { instrumentId: Evaluacion.instrumentId }
			}).then(Factor => {
				/*
					Datos de los Items pertenecientes a esta evaluacion 
					que han sido respondido por el usuario seleccionado
				*/
				models.itemUsuario.findAll({
					include: [models.item],
					where: {
						[Op.and]: [
							{evaluado: req.params.idUser}, 
							{evaluador: req.params.idUser},
							{evaluacionId: req.params.id}
						]
					}
				}).then(Item => {
					models.evaluacionUsuario.findOne({
						where: {
							[Op.and]: [
								{usuarioEvaluado: req.params.idUser}, 
								{evaluacionId: req.params.id},
								{usuarioCedula: req.params.idUser},
								{status: true}
							]
						}
					}).then(dataEvaluacion => {
						var acomulador = [];
						var calificacionFactor = [];

						for(let i = 0; i < Factor.length; i ++) {
							acomulador[i] = 0;
							
							var n = 0;
							console.log('================Nombre Factor: '+Factor[i].factor.nombre+'====================');
							for(let j = 0; j < Item.length; j ++) {
								
								if(Item[j].item.factorId == Factor[i].factorId) {
									n = n + 1;
									//console.log(Item[j].item.nombre);
									acomulador[i] = acomulador[i] + Item[j].calificacion;
									console.log('Acomulador'+[i]+': '+acomulador[i]);
								}
								
								calificacionFactor[i] = acomulador[i]/n;
							}
							console.log('calificacion factor '+Factor[i].factor.nombre+': '+calificacionFactor[i]);
							console.log('nro. de preguntas: '+n);
						}

						//res.send(Factor);
						res.render('president/detalles/autoEval/index', { 
							user, 
							Evaluado, 
							Factor,
							calificacionFactor,
							dataEvaluacion 
						});
					});
				});
			});
		});
	});
}

exports.verCoEval = function(req, res) {
	var user = req.user;

	console.log('============ Detalles de CoEvalución ===========');
	models.usuario.findOne({
		include: [models.nucleo, models.unidad],
		where: { cedula: req.params.idUser }
	}).then(Evaluado => {
		models.usuario.findOne({
			include: [models.nucleo, models.unidad],
			where: { cedula: req.params.idEvaluador }
		}).then(Evaluador => {
			models.evaluacion.findOne({
				include: [ models.instrument ],
				where: { id: req.params.id }
			}).then(Evaluacion => {
				/*
					Datos de los factores pertenecientes al instrumento 
					usado en la evaluacion que encontramos en paso anterior 
				*/
				models.instrumentFactor.findAll({
					include: [ models.factor ],
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Factor => {
					/*
						Datos de los Items pertenecientes a esta evaluacion 
						que han sido respondido por el usuario seleccionado
					*/
					models.itemUsuario.findAll({
						include: [models.item],
						where: {
							[Op.and]: [
								{evaluado: req.params.idUser}, 
								{evaluador: req.params.idEvaluador},
								{evaluacionId: req.params.id}
							]
						}
					}).then(Item => {
						models.evaluacionUsuario.findOne({
							where: {
								[Op.and]: [
									{usuarioEvaluado: req.params.idUser}, 
									{evaluacionId: req.params.id},
									{usuarioCedula: req.params.idEvaluador},
									{status: true}
								]
							}
						}).then(dataEvaluacion => {
							var acomulador = [];
							var calificacionFactor = [];

							for(let i = 0; i < Factor.length; i ++) {
								acomulador[i] = 0;
								
								var n = 0;
								console.log('================Nombre Factor: '+Factor[i].factor.nombre+'====================');
								for(let j = 0; j < Item.length; j ++) {
									
									if(Item[j].item.factorId == Factor[i].factorId) {
										n = n + 1;
										//console.log(Item[j].item.nombre);
										acomulador[i] = acomulador[i] + Item[j].calificacion;
										console.log('Acomulador'+[i]+': '+acomulador[i]);
									}
									
									calificacionFactor[i] = acomulador[i]/n;
								}
								console.log('calificacion factor '+Factor[i].factor.nombre+': '+calificacionFactor[i]);
								console.log('nro. de preguntas: '+n);
							}

							res.render('president/detalles/coEval/index', { 
								user, 
								Evaluador, 
								Evaluado,
								Factor,
								calificacionFactor,
								dataEvaluacion  
							});
						});
					});
				});
			});
		});
	});
}

exports.verEvalSubor = function(req, res) {
	var user = req.user;

	console.log('============ Detalles de Evaluacion a Subordinado ===========');
	models.usuario.findOne({
		include: [models.nucleo, models.unidad],
		where: { cedula: req.params.idUser }
	}).then(Evaluado => {
		models.usuario.findOne({
			include: [models.nucleo, models.unidad],
			where: { cedula: req.params.idEvaluador }
		}).then(Evaluador => {
			/*Buscar la Evaluación con el ID que viene por parametro*/
			models.evaluacion.findOne({
				include: [ models.instrument ],
				where: { id: req.params.id }
			}).then(Evaluacion => {
				/*Buscar todos los Factores que usa el instrumento de eval usado en esta evaluacion*/
				models.instrumentFactor.findAll({
					include: [models.factor],
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Factor => {
					/*
						Datos de los Items pertenecientes a esta evaluacion 
						que han sido respondido por el usuario seleccionado
					*/
					models.itemUsuario.findAll({
						include: [models.item],
						where: {
							[Op.and]: [
								{evaluado: req.params.idUser}, 
								{evaluador: req.params.idEvaluador},
								{evaluacionId: req.params.id}
							]
						}
					}).then(Item => {
						models.evaluacionUsuario.findOne({
							where: {
								[Op.and]: [
									{usuarioEvaluado: req.params.idUser}, 
									{evaluacionId: req.params.id},
									{usuarioCedula: req.params.idEvaluador},
									{status: true}
								]
							}
						}).then(dataEvaluacion => {
							var acomulador = [];
							var calificacionFactor = [];

							for(let i = 0; i < Factor.length; i ++) {
								acomulador[i] = 0;
								
								var n = 0;
								console.log('================Nombre Factor: '+Factor[i].factor.nombre+'====================');
								for(let j = 0; j < Item.length; j ++) {
									
									if(Item[j].item.factorId == Factor[i].factorId) {
										n = n + 1;
										//console.log(Item[j].item.nombre);
										acomulador[i] = acomulador[i] + Item[j].calificacion;
										console.log('Acomulador'+[i]+': '+acomulador[i]);
									}
									
									calificacionFactor[i] = acomulador[i]/n;
								}
								console.log('calificacion factor '+Factor[i].factor.nombre+': '+calificacionFactor[i]);
								console.log('nro. de preguntas: '+n);
							}

							res.render('president/detalles/eval-A-Subor/index', { 
								user,
								Evaluado,
								Evaluador,
								Factor,
								calificacionFactor,
								dataEvaluacion 
							});
						})
					})
				})
			})
		})
	});
}

exports.verEvalJefe = function(req, res) {
	var user = req.user;

	console.log('============ Detalles de Evaluacion a Jefe ===========');
	models.usuario.findOne({
		include: [models.nucleo, models.unidad],
		where: { cedula: req.params.idUser }
	}).then(Evaluado => {
		models.usuario.findOne({
			include: [models.nucleo, models.unidad],
			where: { cedula: req.params.idEvaluador }
		}).then(Evaluador => {
			models.evaluacion.findOne({
				include: [ models.instrument ],
				where: { id: req.params.id }
			}).then(Evaluacion => {
				/*Buscar todos los Factores que usa el instrumento de eval usado en esta evaluacion*/
				models.instrumentFactor.findAll({
					include: [models.factor],
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Factor => {
					/*
						Datos de los Items pertenecientes a esta evaluacion 
						que han sido respondido por el usuario seleccionado
					*/
					models.itemUsuario.findAll({
						include: [models.item],
						where: {
							[Op.and]: [
								{evaluado: req.params.idUser}, 
								{evaluador: req.params.idEvaluador},
								{evaluacionId: req.params.id}
							]
						}
					}).then(Item => {
						models.evaluacionUsuario.findOne({
							where: {
								[Op.and]: [
									{usuarioEvaluado: req.params.idUser}, 
									{evaluacionId: req.params.id},
									{usuarioCedula: req.params.idEvaluador},
									{status: true}
								]
							}
						}).then(dataEvaluacion => {
							var acomulador = [];
							var calificacionFactor = [];

							for(let i = 0; i < Factor.length; i ++) {
								acomulador[i] = 0;
								
								var n = 0;
								console.log('================Nombre Factor: '+Factor[i].factor.nombre+'====================');
								for(let j = 0; j < Item.length; j ++) {
									
									if(Item[j].item.factorId == Factor[i].factorId) {
										n = n + 1;
										//console.log(Item[j].item.nombre);
										acomulador[i] = acomulador[i] + Item[j].calificacion;
										console.log('Acomulador'+[i]+': '+acomulador[i]);
									}
									
									calificacionFactor[i] = acomulador[i]/n;
								}
								console.log('calificacion factor '+Factor[i].factor.nombre+': '+calificacionFactor[i]);
								console.log('nro. de preguntas: '+n);
							}

							res.render('president/detalles/eval-A-Jefe/index', { 
								user,
								Evaluado,
								Evaluador,
								Factor,
								calificacionFactor,
								dataEvaluacion 
							});
						});
					});
				});
			});
		});
	});
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

exports.cambiarCoordP = function(req, res) {
	models.usuario.findOne({
		where: {
			cedula: req.user.cedula
		}
	}).then(usuario => {
		models.usuario.findOne({
			where: {
				[Op.and]: [
					{cedula: req.params.id}, 
					{nucleoCodigo: 1},
					{unidadCodigo: 12},
					{rolId: 3}
				]
			}
		}).then(coordPlani => {
			res.render('president/cambiar/coordP', { usuario, coordPlani });
		});
	});
}

exports.buscarCoordP = function(req, res) {
	var userCedula = parseInt(req.user.cedula); 
	models.usuario.findOne({
		where: {
			cedula: userCedula
		}
	}).then(usuario => {
		models.usuario.findOne({
			where: {
				[Op.and]: [
					{cedula: parseInt(req.params.id)}, 
					{nucleoCodigo: 1},
					{unidadCodigo: 12},
					{rolId: 3}
				]
			}
		}).then(coordPlani => {
			models.usuario.findOne({
				include: [ models.nucleo, models.unidad ],
				where: {
					[Op.and]: [
						{cedula: req.body.cedula}
					]
				}	
			}).then(Reemplazo => {
				res.render('president/cambiar/buscarCoordP', { usuario, coordPlani, Reemplazo });	
			});
		});
	});
}

exports.getUnidades = function(req, res) {
	models.unidad.findAll({
		where: { nucleoCodigo: req.params.id }
	}).then(Unidades => {
		res.json(Unidades)
	}).catch(err => {
		console.log(err)
	})
}

exports.cambiarCoordPla = function(req, res) {
	res.render('president/cambiar/index');
}

//buscar coordinador de planificacion
exports.getCoordP = function(req, res) {
	models.usuario.findOne({
		where: {
			rolId: 3
		}
	}).then(coordP => {
		res.json(coordP)
	}).catch(err => {
		res.send(err)
	})
}

//buscar Usuario
exports.getUsuario = function(req, res) {
	models.usuario.findOne({
		where: {
			cedula: req.params.id
		}
	}).then(Usuario => {
		res.json(Usuario)
	}).catch(err => {
		console.log(err)
	})
}

//Ver Historial de Evaluaciones en una Unidad
exports.getEvaluaciones = function(req, res) {
	models.usuario.findOne({
		include: [models.nucleo, models.unidad],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		models.unidad.findOne({
			include: [ models.nucleo ],
			where: {
				codigo: req.params.id
			}
		}).then(Unidad => {
			models.usuario.findAll({
				include: [ models.cargo ],
				where: {
					unidadCodigo: req.params.id
				}
			}).then(Users => {
				/*
					Buscar todas la Evaluacion que se le han hecho a la unidad seleccionada
					donde el instrumento usado sea de tipo 4
				*/
				models.evaluacion.findAll({
					where: {
						[Op.and]: [ 
							{unidadCodigo: req.params.id},
							{instrumentId: 4}
						]
					}
				}).then(Evals => {
					//ultima Calificacion
					models.calificacion.findAll({
						order: [
							['id', 'DESC']
						],
						where: {
							unidadCodigo: req.params.id
						}
					}).then(califiUnidad => {
						res.render('president/nucleos/unidad/index', { Usuario, Unidad, Users, Evals, califiUnidad })
					})	
				})
			})
		})
	})
}

exports.saveCalifi = function(req, res) {
	models.calificacion.create({
		value: req.body.value,
		evaluacionId: req.params.id,
		unidadCodigo: req.body.unidad
	}).then(califiUnidad => {
		res.redirect('/president/detalles/'+ req.params.id);
	})
}