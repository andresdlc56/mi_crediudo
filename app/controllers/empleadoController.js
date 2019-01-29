var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

/*============Index controlador Empleado=============*/
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
							models.observacion.findAll({
								where: {
									usuarioCedula: req.user.cedula,
									status: false
								},
								include: [ models.evaluacion ]
							}).then(Observacion => {
								res.render('empleado/evaluacion/autoEval', { 
									Usuario, 
									dataEval, 
									autoEval,
									Observacion 
								});
							})
						});
					})
				})	
			})	
		});
	}

	/*-----------------Controlador para ver el contenido de una evaluación disponible------------*/
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
							models.observacion.findAll({
								where: {
									usuarioCedula: req.user.cedula,
									status: false
								},
								include: [ models.evaluacion ]
							}).then(Observacion => {
								res.render('empleado/evaluacion/evaluaciones', { 
									Usuario, 
									dataEvaluacion, 
									Jefe, 
									Observacion
								});		
							})
						})
						
				})
			})
		}

		/*--------------------Renderizar Prueba-------------------------------*/
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
										models.observacion.findAll({
											where: {
												usuarioCedula: req.user.cedula,
												status: false
											},
											include: [ models.evaluacion ]
										}).then(Observacion => {
											if (Evaluador.nucleoCodigo == Evaluacion.nucleoCodigo && Evaluador.unidadCodigo == Evaluacion.unidadCodigo) {
												//res.send(evaluacionUsuario);
												res.render('empleado/evaluacion/examen/prueba', { 
													Evaluador,
													Evaluado, 
													Evaluacion, 
													Factor, 
													Item,
													Observacion
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
				});
			}


	/*==================Controladores Axios=================================*/
		/*----------------Controlador Axios para solicitar la autoEval Dispoble-------------*/
			exports.buscarAutoE = function(req, res) {
				models.evaluacionUsuario.findOne({
					where: {
						[Op.and]: [
							{usuarioCedula: req.params.cedula}, 
							{evaluacionId: req.params.id},
							{status: false}
						]
					}
				}).then(autoEval => {
					res.json(autoEval)
				}).catch(err => {
					console.log(err)
				})
			}

		/*--------------Controlador axios solicitar coEvals dispobibles---------*/
			exports.buscarCoEvals = function(req, res) {
				models.evaluacionUsuario.findAll({
					include: [ models.usuario ],
					where: {
						[Op.and]: [
							{usuarioCedula: req.params.cedula}, 
							{evaluacionId: req.params.id},
							{status: false}
						]
					}
				}).then(coEvals => {
					res.json(coEvals);
				}).catch(err => {
					console.log(err);
				})
			}

		/*----------------Controlador axios solicitar eval-a-Jefe dispobibles---------*/
			exports.buscarEvalaJefe = function(req, res) {
				var cedula = parseInt(req.params.cedula);
				var id = parseInt(req.params.id);

				models.evaluacionUsuario.findOne({
					where: {
						[Op.and]: [
							{usuarioCedula: req.params.evaluador},
							{usuarioEvaluado: cedula}, 
							{evaluacionId: id},
							{status: false}
						]
					}
				}).then(evalaJefe => {
					res.json(evalaJefe);
				}).catch(err => {
					res.json('error');
				})
			}

		/*----------------Controlador axios solicitar eval-a-Subord dispobibles----------*/
			exports.buscarEvalsaSubor = function(req, res) {
				models.evaluacionUsuario.findAll({
					include: [ models.usuario ],
					where: {
						[Op.and]: [
							{ evaluacionId: req.params.id }, 
							{status: false}
						]
					}
				}).then(evalsaSubor => {
					res.json(evalsaSubor);
				}).catch(err => {
					console.log(err)
				})
			}


/*=========================================================================================*/



/*==============Procesando una Prueba================*/
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

	exports.procesarPruebaOtro = function(req, res) {
		let factores = [];
		let acumulador = [];
		var preguntas = []; //arreglo para almacenar el numero de preguntas de un factor (j)
		var valueItem = []; //arreglo para almacenar el valor de los items seleccionados por el user
		var calificacionFactor = []; //arreglo que almacena la calificacion que obtuvo el usuario en los factores
		
		/*-------Datos de la Evaluación------*/
		models.evaluacion.findOne({
			include: [ models.instrument ],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			/*--------Factores q pertenecen a un instrumento q se usa en esta Evaluacion--------*/
			models.instrumentFactor.findAll({
				include: [ models.factor ],
				where: { instrumentId: Evaluacion.instrumentId }
			}).then(Factores => {
				/*---------Items q pertenecen a un instrumento que se usa en esta evaluacion----------*/
				models.item.findAll({
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Items => {
					
					let totalFactores = 0;
					let acumuladorFactores = 0;

					/*---Recorrer todos los factores encontrados---*/
					for(let j = 0; j < Factores.length; j ++) {
						acumulador[j] = 0;
						
						//n[j] = 0;
						preguntas[j] = 0;
						calificacionFactor[j] = 0;
						/*----Recorrer todos los items encontrados----*/
						for(let i = 0; i < Items.length; i ++) {
							/*---
								Si el item seleccionado en el ciclo "i" 
								tiene factorId == al Factor seleccionado 
								en el ciclo "j"
							---*/
							if(Items[i].factorId == Factores[j].factorId){
								/*--guardar el valor de la respuesta dada por el usuario en el arreglo valueItem[i]--*/
								valueItem[i] = parseInt(req.body.item[i])

								if(valueItem[i]){
									/*---Sumar 1 al contador de preguntas pertenecientes al factor "j"--*/
									preguntas[j] = preguntas[j] + 1;

									/*---
										(acumulador) arreglo que almacena o reune el valor de todos los items selecionados que
										pertenecen a el factor j 
									---*/
									acumulador[j] = acumulador[j] + valueItem[i];
									console.log('Nro de preguntas pertenecientes al factor '+j+': ' + preguntas[j]);

									
									models.itemUsuario.create({
										calificacion: valueItem[i],
										evaluacionId: req.params.id,
										itemId: Items[i].id,
										evaluado: req.params.idu,
										evaluador: req.body.Evaluador
									}).then(itemUsuario => {
										console.log('====Respuesta Almacenada=====');
									})
								}	
							}
						} 
						/*---Imprimir en consola cuanto tiene acumulado el factor j---*/
						console.log('Factor '+j+': '+acumulador[j]);

						/*---Calcular la Calificacion del Factor "j"--*/
						calificacionFactor[j] = acumulador[j] / preguntas[j];

						/*----acumular la calificacion de todos los factores en una variable---*/
						acumuladorFactores = acumuladorFactores + calificacionFactor[j];



						/*----Imprimir en consola la calificacion de un usuario en el factor "j"----*/
						console.log('========Calificacion en el Factor '+Factores[j].factor.nombre+': '+calificacionFactor[j]);

						/*----(totalFactores) varible q almacena o acumula la calificacion de los factores--*/
						totalFactores = totalFactores + calificacionFactor[j];

						/*-----almacenando la calificacion de un usuario en un factor de una evaluacion determinada------*/
						models.factorUsuario.create({
							calificacion: calificacionFactor[j],
							evaluacionId: req.params.id,
							factorId: Factores[j].factorId,
							usuarioCedula: req.params.idu
						}).then(califiFactor => {
							console.log('----------------Calificacion del Usuario '+req.params.idu+' en el factor '+Factores[j].factor.nombre+' almacenada');
						})
					}

					/*----Imprimir por consola las calificaciones de los factores acumuladas-----*/
					console.log('==============Calificaciones de factores acumuladas: '+totalFactores);

					/*-----variable que almacena la calificacion final de un usuario en ese examen o prueba------*/
					var calificacionFinal = totalFactores / Factores.length;

					/*----Imprimir por consola la calificacion final de un usuario en el examen que presento----*/
					console.log('===============Calificacion Final: '+calificacionFinal);

					/*
						Actualizar la calificacion y el status de la evaluacion realizada por el usuario
					*/
					
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
				})
			})
		})
	}
/*==============Fin Procesamiento de Prueba===================*/

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

exports.verCalificacion = function(req, res) {
	var user = req.user;

	models.observacion.findOne({
		where: {
			[Op.and]: [
				{evaluacionId: req.params.id}, 
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

exports.verResultado = function(req, res) {
	var idA = parseInt(req.params.id); //AutoEval
	var idB = parseInt(req.params.id)+1; //CoEval
	var idC = parseInt(req.params.id)+2; //EvalaJefe
	var idD = parseInt(req.params.id)+3; //EvalaSubordinados

	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		models.observacion.findAll({
			where: {
				[Op.and]: [
					{usuarioCedula: req.user.cedula},
					{status: false}
				]
			},
			include: [ models.evaluacion ]
		}).then(Observacion => {
			models.observacion.findOne({
				include: [ models.evaluacion ],
				where: { evaluacionId: req.params.id }
			}).then(Resultado => {
				models.factorUsuario.findAll({
					include: [ models.evaluacion ],
					where: {
						evaluacionId: [idA, idB, idC, idD],
						usuarioCedula: req.user.cedula
					}
				}).then(calificacionFactor => {
					if(Usuario.cargoId == 3) {
						models.evaluacion.findOne({
							include: [ models.instrument ],
							where: { id: idA }
						}).then(dataEval => {
							models.instrumentFactor.findAll({
								include: [ models.factor ],
								where: {
									instrumentId: dataEval.instrumentId
								}
							}).then(Factores => {
								res.render('empleado/resultados/uno', { 
									Usuario, 
									Observacion, 
									Resultado,
									calificacionFactor,
									Factores
								});
								//res.send(Factores);
							})
						})
					} else {
						res.send("Controlador en contruccion para usuario de cargo 2");
					}
				})
			})
		})
	})
}

exports.resultadosTodos = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		models.observacion.findAll({
			where: {
				[Op.and]: [
					{usuarioCedula: req.user.cedula},
					{status: false}
				]
			},
			include: [ models.evaluacion ]
		}).then(Observacion => {
			models.observacion.findAll({
				include: [ models.evaluacion ],
				where: { usuarioCedula: req.user.cedula }
			}).then(Resultados => {
				res.render('empleado/resultados/todos', {Usuario, Observacion, Resultados});
			})
		})
	})
}

exports.cambiarStatus = function(req, res) {
	models.observacion.update({
		status: true
	}, {
		where: { evaluacionId: req.params.id }
	}).then(Observacion => {
		res.json('Visto')
	}).catch(err => {
		res.json(err)
	})
}