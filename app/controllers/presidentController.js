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
		include: [ models.nucleo, models.unidad ],
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
					[Op.or]: [{instrumentId: 4}, {instrumentId: 6}]
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
						[Op.or]: [{instrumentId: 4}, {instrumentId: 6}]
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
										[Op.or]: [{instrumentId: 4}, {instrumentId: 6}]
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
									where: { 
										[Op.or]: [{instrumentId: 4}, {instrumentId: 6}]
									}
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
			where: {
				[Op.or]: [{instrumentId: 4}, {instrumentId: 6}]
			}
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
					[Op.or]: [{instrumentId: 1}, {instrumentId: 6}]
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
					[Op.or]: [{instrumentId: 1}, {instrumentId: 6}]
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
	
	
	/*
		Buscar los datos de la evaluacion que viene por parametro
	*/
	models.evaluacion.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { id: req.params.id }
	}).then(infoEval => {
		if(infoEval.categoriumId == 1) {
			var idB = parseInt(req.params.id) + 1;
			var idC = parseInt(req.params.id) + 2;
			var idD = parseInt(req.params.id) + 3;
			var idE = parseInt(req.params.id) + 4;

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
							models.evaluacionUsuario.findOne({
								include: [ models.evaluacion ],
								where: {
									evaluacionId: idE
								}
							}).then(autoEvalJefe => {
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
													califiUni,
													autoEvalJefe
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
		} else{

			var idB = parseInt(req.params.id) + 1; //AutoEvalSubordinado
			var idC = parseInt(req.params.id) + 2; //Eval-a-Jefe
			var idD = parseInt(req.params.id) + 3;	//Evals-a-Subordinados

			/*
				Buscar toda info de la autoEvaluacion del jefe del centro de Investi 
			*/
			models.evaluacionUsuario.findOne({
				include: [models.evaluacion],
				where: {
					evaluacionId: req.params.id
				}
			}).then(autoEvalJefe => {
				/*
					Buscar autoEvaluaciones del centro de Investi 
				*/
				models.evaluacionUsuario.findAll({
					include: [models.evaluacion],
					where: {
						[Op.or]: [{evaluacionId: req.params.id}, {evaluacionId: idB}]
					}
				}).then(autoEval => {
					/*
						Buscar toda info de la eval al jefe que le hacen 
						subordinados del centro de Investi 
					*/
					models.evaluacionUsuario.findAll({
						include: [models.evaluacion],
						where: {
							evaluacionId: idC		
						}
					}).then(evalJefe => {
						/*
							Buscar toda evaluaciones a los subordinados por 
							parte del jefe del centro de invest 
						*/
						models.evaluacionUsuario.findAll({
							include: [models.evaluacion],
							where: {
								evaluacionId: idD	
							}
						}).then(evalSubor => {
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
									var evalTotal = autoEval.length + evalSubor.length + evalJefe.length;
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
												evalSubor,
												evalJefe,
												dataUser,
												evalTotal,
												evalListas, 
												Calificacion,
												acomulado,
												califiUni,
												autoEvalJefe
											});
										})
									})
								})
							})
						})
					})	
				})
			});			
		}		
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

	/*
		Buscar la informacion de la evaluacion que viene por parametro
	*/
	models.evaluacion.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { id: req.params.id }
	}).then(infoEval => {
		//Si la categoria de la evalucion es 1 (administrativo)
		if(infoEval.categoriumId == 1) {
			var idB = parseInt(req.params.id)+1;//id q representa la coevaluacion
			var idC = parseInt(req.params.id)+2;//id q representa evaluacion al jefe
			var idD = parseInt(req.params.id)+3;//id q representa evaluacion al subordinado
			var idE = parseInt(req.params.id)+4;//id q representa autoEvaluacion Jefe
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

									acomuladoAutoeval = autoEval.calificacion * 0.10;
									acomuladoJefe = evaldJefe.calificacion * 0.50;
									acomuladoCoeval = calificacion * 0.40;
									califiGeneral = Math.trunc(acomuladoAutoeval) + Math.trunc(acomuladoCoeval) + Math.trunc(acomuladoJefe);

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
								{evaluacionId: idE},
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

									/*-----Aqui se maneja el porcentaje o peso para calificar al jefe---*/
									acomuladoAutoeval = autoEval.calificacion * 0.30;
									acomuladoSubor = calificacion * 0.70;
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
										console.log('Calificacion General: '+califiGeneral);
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
		} else {
			var idB = parseInt(req.params.id)+1;//id q representa la autoEval (subordi)
			var idC = parseInt(req.params.id)+2;//id q representa evaluacion al jefe
			var idD = parseInt(req.params.id)+3;//id q representa evaluacion a los subordinado

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
				//Si el Usuario encontrado tiene cargo 2 (jefe-subordinado)
				if(User.cargoId == 2) {
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

									/*-----Aqui se maneja el porcentaje o peso para calificar al jefe---*/
									acomuladoAutoeval = autoEval.calificacion * 0.30;
									acomuladoSubor = calificacion * 0.70;
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
										console.log('Calificacion General: '+califiGeneral);
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
							})
						})
					})
				} 
				//Si el Usuario encontrado tiene cargo 3 (Subordinado)
				else if(User.cargoId == 3) {

				}
			})
		}
	});
}

/*=============Subir Observacion mas Calificacion=======*/
exports.calificar = function(req, res) {
	var calificacion = req.body.calificacion;

	var factorAutoE = [];
	var factorCoEval = [];
	
	var autoEval = [];
	var n = [];
	var parcialAutoEval = [];

	var coEval = [];
	var m = [];
	var parcialCoeval = [];
	var media = [];

	/*----Tratando de calcular la calificacion general de un factor----*/
		/*----------Buscar los datos de la evaluacion-------*/
			models.evaluacion.findOne({
				where: { id: req.params.id }
			}).then(Evaluacion => {
				models.itemUsuario.findAll({
					include: [ models.item ],
					where: {
						evaluacionId: req.params.id,
						evaluado: req.params.idUser
					}
				}).then(ItemsAutoE => {
					models.itemUsuario.findAll({
						include: [ models.item ],
						where: {
							evaluacionId: parseInt(req.params.id)+1,
							evaluado: req.params.idUser
						}
					}).then(ItemsCoEval => {
						models.instrumentFactor.findAll({
							include: [ models.factor ],
							where: { instrumentId: Evaluacion.instrumentId }
						}).then(Factores => {
							for(let i = 0; i < Factores.length; i ++) {

								factorAutoE[i] = 0;
								autoEval[i] = 0;
								n[i] = 0;
								parcialAutoEval[i] = 0;
								
								/*--Para Calcular cuantos puntos tiene acomulado un factor (AutoEval)--*/
								for(let j = 0; j < ItemsAutoE.length; j ++) {
									if(ItemsAutoE[j].item.factorId == Factores[i].factorId) {
										factorAutoE[i] = factorAutoE[i] + ItemsAutoE[j].calificacion;
										n[i] = n[i] + 1;
									}
								}

								factorCoEval[i] = 0;
								coEval[i] = 0;
								m[i] = 0;
								parcialCoeval[i] = 0;
								media[i] = 0;

								/*--Para Calcular cuantos puntos tiene acomulado un factor (CoEval)--*/
								for(let k = 0; k < ItemsCoEval.length; k ++) {
									if(ItemsCoEval[k].item.factorId == Factores[i].factorId) {
										factorCoEval[i] = factorCoEval[i] + ItemsCoEval[k].calificacion;
										m[i] = m[i] + 1;
									}
								}

								
								autoEval[i] = factorAutoE[i] / n[i];
								//coEval[i] = (factorCoEval[i] / m[i]) / 3;

								//media[i] = media[i] + coEval[i];

								/*----Para calcular tiene este factor segun la autoEval (10% de la nota general)*/
								parcialAutoEval[i] = autoEval[i] * 0.10;
								
								/*----Para calcular tiene este factor segun la autoEval (20% de la nota general)*/
								//parcialCoeval[i] = (media[i] * 5) / 10;
								
								console.log('----------'+Factores[i].factor.nombre+': '+parcialAutoEval[i]);
								//console.log('----------'+Factores[i].factor.nombre+': '+parcialCoeval[i]);
							}
						})
					})
				})
			})
		
		

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
	var fechaActual = new Date();

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Presidente => {
		models.evaluacion.findAll({
			include: [models.nucleo, models.unidad],
			where: { instrumentId: 1 }
		}).then(Evaluaciones => {
			//res.send(Evaluaciones);
			res.render('president/historial/index', { 
				Presidente, 
				Evaluaciones,
				fechaActual
			});		
		});	
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
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('president/cambiar/coordP', { Usuario });
	}).catch(err => {
		console.log(err);
	});
}

exports.cambiarCoordEval = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('president/cambiar/coordE', { Usuario });
	}).catch(err => {
		console.log(err);
	});
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

//buscar coordinador de Evaluacion
exports.getCoordE = function(req, res) {
	models.usuario.findOne({
		where: {
			rolId: 4
		}
	}).then(coordE => {
		res.json(coordE)
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
				order: [
						['cargoId', 'ASC']
				],
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
						include: [ models.evaluacion, models.unidad ],
						order: [
							['id', 'DESC']
						],
						where: {
							unidadCodigo: req.params.id
						}
					}).then(califiUnidad => {
						res.render('president/nucleos/unidad/index', { 
							Usuario, 
							Unidad, 
							Users, 
							Evals, 
							califiUnidad 
						})
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

//---------Ver el Perfil de un Usuario determinado-----
exports.userPerfil = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Presidente => {
		models.unidad.findOne({
			include: [ models.nucleo ],
			where: { codigo: req.params.unidadCodigo }
		}).then(Unidad => {
			models.usuario.findOne({
				include: [ models.cargo, models.rol, models.nucleo, models.unidad ],
				where: { cedula: req.params.userCedula }
			}).then(Usuario => {
				models.observacion.findAll({
					include: [ models.evaluacion, models.usuario ],
					order: [
						['id', 'DESC']
					],
					where: { usuarioCedula: Usuario.cedula }
				}).then(Observaciones => {
					models.evaluacion.findAll({
						include: [ models.nucleo, models.unidad ],
						where: {
							unidadCodigo: Usuario.unidadCodigo,
							instrumentId: 1
						}
					}).then(Evaluaciones => {
						res.render('president/nucleos/unidad/userPerfil/index', {
							Presidente,
							Unidad,
							Usuario,
							Observaciones,
							Evaluaciones
						});	
					});
				});
			});
		});
	});
};

//----Ver detalles de un Usuario en una Evaluacion especifica----
exports.detallesEvalUser = function(req, res) {
	var idA = parseInt(req.params.evalId); //AutoEvaluacion
	var idB = parseInt(req.params.evalId) + 1; //CoEvaluacion
	var idC = parseInt(req.params.evalId) + 2; //Evaluacion a Jefe
	var idD = parseInt(req.params.evalId) + 3; //Evaluacion a Subordinado
	var idE = parseInt(req.params.evalId) + 4; //AutoEvaluacion Jefe

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Presidente => {
		models.usuario.findOne({
			include: [ models.nucleo, models.unidad, models.cargo ],
			where: { cedula: req.params.userCedula }
		}).then(Usuario => {
			/*--Informacion de la unidad a la q pertence el usuario---*/
			models.unidad.findOne({
				include: [ models.nucleo ],
				where: { codigo: Usuario.unidadCodigo }
			}).then(Unidad => {
				models.observacion.findOne({
					include: [ models.evaluacion ],
					where: { evaluacionId: req.params.evalId }
				}).then(califiGeneral => {
					/*-- Buscamos las Calif del Usuario por cada factor en cada Evaluacion --*/
					models.factorUsuario.findAll({
						order: [['id', 'ASC']],
						include: [ models.evaluacion ],
						where: {
							evaluacionId: [idA, idB, idC, idD, idE],
							usuarioCedula: Usuario.cedula
						}
					}).then(calificacionFactor => {
						if(Usuario.cargoId == 3) {
							models.evaluacion.findOne({
								include: [ models.instrument ],
								where: { id: idA }
							}).then(Evaluacion => {
								models.instrumentFactor.findAll({
									include: [ models.factor ],
									where: {
										instrumentId: Evaluacion.instrumentId
									}
								}).then(Factores => {
									models.evaluacionUsuario.findOne({
										where: {
											usuarioCedula: req.params.userCedula,
											usuarioEvaluado: req.params.userCedula,
											evaluacionId: req.params.evalId,
											status: true
										}
									}).then(autoEval => {
										var autoEvaluacion = parseInt(autoEval.calificacion);
										console.log("========================"+autoEval.calificacion);
										
										/*
											Buscar todas la coEvaluaciones realizadas por los compañeros 
											del usuario seleccionado
										*/
										models.evaluacionUsuario.findAll({
											where: {
												[Op.and]: [
													{usuarioEvaluado: Usuario.cedula}, 
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
															{usuarioEvaluado: Usuario.cedula}, 
															{evaluacionId: idD},
															{status: true}
														]
													}
												}).then(evaldJefe => {
													res.render('president/nucleos/unidad/userPerfil/detallesEval', {
														Presidente,
														Usuario,
														Unidad,
														calificacionFactor,
														califiGeneral,
														Evaluacion,
														Factores,
														autoEvaluacion,
														calificacion,
														evaldJefe
													});
												})
											} else {
												res.send('Aun no ha sido CoEvaluado 3 veces');
											}
										});		
									})
								})
							})
						} else {
							res.send("Controlador en contruccion para usuario de cargo 2");
						}
					})
				})

				
			})	
		})	
	})
};

exports.getFactoresAutoEval = function(req, res) {
	models.factorUsuario.findAll({
		where: {
			usuarioCedula: req.params.userCedula,
			evaluacionId: req.params.autoEvalId
		}
	}).then(Factores => {
		res.json(Factores);
	}).catch(err => {
		res.json('errorrr');
	});
}

exports.getObservacion = function(req, res) {
	models.observacion.findOne({
		where: {
			usuarioCedula: req.params.userCedula,
			evaluacionId: req.params.idEval
		}
	}).then(Observacion => {
		res.json(Observacion);
	}).catch(err => {
		res.json(err)
	})
}

exports.reemplazar = function(req, res) {
	models.usuario.findOne({
		where: { cedula: req.body.cedulaReemplazado }
	}).then(usuarioUno => {
		models.usuario.findOne({
			where: { cedula: req.body.cedulaCandidato }
		}).then(usuarioDos => {
			if(usuarioDos.crediudo == false) {
				models.usuario.update({
					nucleoCodigo: req.body.nucleoCandidato,
					unidadCodigo: req.body.unidadCandidato,
					cargoId: req.body.cargoCandidato,
					rolId: req.body.rolCandidato,
					crediudo: false
				},{
					where: {
						cedula: req.body.cedulaReemplazado
					}
				}).then(exEncargado => {
					models.usuario.update({
						nucleoCodigo: req.body.nucleoReemplazado,
						unidadCodigo: req.body.unidadReemplazado,
						cargoId: req.body.cargoReemplazado,
						rolId: req.body.rolReemplazado,
						crediudo: true	
					}, {
						where: {
							cedula: req.body.cedulaCandidato
						}
					}).then(newEncargado => {
						console.log('=====================Usuarios Actualizados Exitosamente========================');
						req.flash('info', 'Actualización Exitosa!');
						res.redirect('/president');
					})
				})
			} else {
				models.usuario.update({
					nucleoCodigo: req.body.nucleoCandidato,
					unidadCodigo: req.body.unidadCandidato,
					cargoId: req.body.cargoCandidato,
					rolId: req.body.rolCandidato
				},{
					where: {
						cedula: req.body.cedulaReemplazado
					}
				}).then(exEncargado => {
					models.usuario.update({
						nucleoCodigo: req.body.nucleoReemplazado,
						unidadCodigo: req.body.unidadReemplazado,
						cargoId: req.body.cargoReemplazado,
						rolId: req.body.rolReemplazado
					}, {
						where: {
							cedula: req.body.cedulaCandidato
						}
					}).then(newEncargado => {
						console.log('=====================Usuarios Actualizados Exitosamente========================');
						req.flash('info', 'Actualización Exitosa!');
						res.redirect('/president');
					})
				})
			}
		})
	})
}

exports.asignarCoordP = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(presidente => {
		res.render('president/asignar/coordPlani', { presidente });	
	}).catch(err => {
		console.log(err);
	})
}

exports.asignaCoordP = function(req, res) {
	models.usuario.update({
		nucleoCodigo: 1,
		rolId: 3,
		cargoId: 2,
		unidadCodigo: 12,
		crediudo: true
	},{
		where: {
			cedula: req.body.cedula
		}
	}).then(Usuario => {
		console.log('=======' + req.body.cedula + '===========')
		req.flash('info', 'Coord. Planificación Asignado Exitosamente!');
		res.redirect('/president');
		//res.send(Usuario);
	});
}