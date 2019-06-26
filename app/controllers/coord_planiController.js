var exports = module.exports = {}

var models = require('../models');
var multer = require('multer'); //para el manejo de multipart/form usado para cargar archivos
const path = require('path');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

//================Controlador Inicial Coord Planificación =============
exports.index = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad, models.rol ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		/*
			buscando 3 evalucaiones donde
			donde usen un instrumento de evaluacion de tipo 1 (AutoEvaluacion)
			y ordenalos de forma decendente  
		*/
		models.evaluacion.findAll({
			include: [models.categoria, models.nucleo, models.unidad, models.instrument],
			limit: 3,
			where: {
				instrumentId: 1	
			},
			order: [
				['fecha_i', 'DESC']
			]
		}).then(Evaluaciones => {
			//buscando todos los tipos de valuaciones
			models.tipoEval.findAll({

			}).then(tipoEval => {
				models.evento.findAll({

				}).then(Eventos => {
					models.noticia.findAll({

					}).then(Noticias => {
						//res.send(Evaluaciones);
						res.render('coord_plani/index', { 
							Evaluaciones, 
							tipoEval,
							Usuario,
							Eventos,
							Noticias,
							message: req.flash('info'),
			        		error: req.flash('error')
						});
					})
				})	
			});
		});
	});
}

//===============Controlador para Mostrar Formulario de planificación de Evaluacion====
exports.planiEval = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		//buscando todas las categorias
		models.categoria.findAll({

		}).then(Categorias => {
			//buscando todos los nucleos
			models.nucleo.findAll({

			}).then(Nucleos => {
				res.render('coord_plani/evaluacion/planificar', { 
					Usuario, 
					Categorias, 
					Nucleos,
					message: req.flash('info'),
			        error: req.flash('error') 
				});	
			});
		});	
	});
}

exports.addEval = function(req, res) {
	//Si la categoria es 1 (Personal Administrativo)
	if(req.body.categoria == 1) {
		//Buscar cuantos Usuarios tiene la unidad donde se planifico la eval
		models.usuario.findAll({
			where: { unidadCodigo: req.body.unidad }
		}).then(Usuarios => {
			if(Usuarios.length > 4) {
				models.instrument.findOne({
					where: { tipoEvalId: 1 }
				}).then(autoEval => {
					//creando una nueva evaluación 
					models.evaluacion.create({
						nombre: req.body.nombre,
						categoriumId: req.body.categoria,
						nucleoCodigo: req.body.nucleo,
						fecha_i: req.body.fecha_i,
						fecha_f: req.body.fecha_f,
						unidadCodigo: req.body.unidad,
						instrumentId: autoEval.id
					}).then(uno => {
						models.instrument.findOne({
							where: { tipoEvalId: 2 }
						}).then(coEval => {
							//creando una nueva evaluación CoEval
							models.evaluacion.create({
								nombre: req.body.nombre,
								categoriumId: req.body.categoria,
								nucleoCodigo: req.body.nucleo,
								fecha_i: req.body.fecha_i,
								fecha_f: req.body.fecha_f,
								unidadCodigo: req.body.unidad,
								instrumentId: coEval.id
							}).then(dos => {
								models.instrument.findOne({
									where: { tipoEvalId: 3 }
								}).then(eval_a_jefe => {
									//creando una nueva evaluación eval_a_Jefe
									models.evaluacion.create({
										nombre: req.body.nombre,
										categoriumId: req.body.categoria,
										nucleoCodigo: req.body.nucleo,
										fecha_i: req.body.fecha_i,
										fecha_f: req.body.fecha_f,
										unidadCodigo: req.body.unidad,
										instrumentId: eval_a_jefe.id
									}).then(tres => {
										models.instrument.findOne({
											where: { tipoEvalId: 4 }
										}).then(eval_a_subor => {
											//creando una nueva evaluación evalSubor
											models.evaluacion.create({
												nombre: req.body.nombre,
												categoriumId: req.body.categoria,
												nucleoCodigo: req.body.nucleo,
												fecha_i: req.body.fecha_i,
												fecha_f: req.body.fecha_f,
												unidadCodigo: req.body.unidad,
												instrumentId: eval_a_subor.id
											}).then(cuatro => {
												models.instrument.findOne({
													where: { tipoEvalId: 5 }
												}).then(autoEvalJefe => {
													models.evaluacion.create({
														nombre: req.body.nombre,
														categoriumId: req.body.categoria,
														nucleoCodigo: req.body.nucleo,
														fecha_i: req.body.fecha_i,
														fecha_f: req.body.fecha_f,
														unidadCodigo: req.body.unidad,
														instrumentId: autoEvalJefe.id
													}).then(cinco => {
														/*
															Busca las ultimas 5 evaluaciones creadas
														*/
														models.evaluacion.findAll({
															include: [models.instrument],
															limit: 5,
															order: [
																['id', 'DESC']
															]
														}).then(Evaluaciones => {
															/*
																Buscar todos los Usuarios que pertenecen a la unidad seleccionada
															*/
															models.usuario.findAll({
																where: { 
																	[Op.and]: [
																		{nucleoCodigo:req.body.nucleo}, 
																		{unidadCodigo:req.body.unidad}
																	] 
																}
															}).then(Usuario => {
																/*
																	hacer un ciclo en las ultimas 5 evaluaciones recien creadas
																*/
																for(let i = 0; i < Evaluaciones.length; i ++) {
																	//Si la Evaluacion[i] es de tipo Auto-Eval
																	if(Evaluaciones[i].instrument.tipoEvalId == 1) {
																		//hacemos un recorrido por todos los usuarios que encontramos
																		for(let j = 0; j < Usuario.length; j ++) {
																			// si el Usuario[j] tiene cargo 3 (subordinado)
																			if(Usuario[j].cargoId == 3) {
																				/*
																					se creara un registro en la tabla evaluacionUsuario j cantidad
																					de veces 
																				*/
																				models.evaluacionUsuario.create({
																					calificacion: null,
																					status: false,
																					evaluacionId: Evaluaciones[4].id,
																					usuarioCedula: Usuario[j].cedula,
																					usuarioEvaluado: Usuario[j].cedula
																				})
																			}
																		}
																	}
																	//Si la evaluacion es de tipo Co-Eval
																	else if(Evaluaciones[i].instrument.tipoEvalId == 2) {
																		/*
																			Buscamos todos los usuarios que pertenescan al nucleo que viene por 
																			pametro que pertenescan a la unidad seleccionada en formalario anterior 
																			que tengan cargo 3 (Empleado) y rol 5. estos representaran a 
																			los usuarios Evaluados
																		*/
																		models.usuario.findAll({
																			where: {
																				[Op.and]: [
																					{nucleoCodigo:req.body.nucleo},
																					{unidadCodigo:req.body.unidad},
																					{cargoId:3},
																					{rolId:5}
																				]
																			}
																		}).then(Evaluado => {
																			/*hacemos un recorrido por todos los evaluados*/
																			for(let m = 0; m < Evaluado.length; m ++) {
																				/*arreglo que guardara usuarios elgidos de manera aleatoria*/
																				var aleatorio = ['uno', 'dos', 'tres'];
																				/*
																					Buscamos a todos los usuarios que pertenescan al nucleo que viene
																					por parametro, que pertenescan a la unidad previamente seleccionada 
																					en el formulario anterior, que tengan cargo 3, rol 5 y su cedula no sea igual a
																					Evaluado[m]. es decir encontrara a todos los usuarios que cumplan con esas condiciones 
																					menos uno (Evaluado[m])
																				*/
																				models.usuario.findAll({
																					where: {
																						[Op.and]: [
																							{nucleoCodigo:req.body.nucleo},
																							{unidadCodigo:req.body.unidad},
																							{cargoId:3},
																							{rolId:5},
																							{cedula: { [Op.ne]: Evaluado[m].cedula }}
																						]
																					}
																				}).then(Evaluador => {
																					/*
																						Debido a que cada Evaluado debe ser Evaluado 3 veces repetimos las
																						siguientes instrucciones 3 veces
																					*/
																					for(let n = 0; n < 3; n ++) {
																						/*console.log() para ir viendo los resultados por consola*/
																						console.log('============Randon'+n+'=========');
																						/*
																							asignamos al arreglo aleatorio[n] una cedula aleatoria proveniente de 
																							Evaluador[valor aleatorio].cedula
																						*/
																						aleatorio[n] = Evaluador[Math.floor(Math.random() * Evaluador.length)].cedula;
																						/*Mostramos por consola el Evaluador seleccionado aleatoriamente y su Evaluado*/
																						console.log('Evaluador: '+aleatorio[n] +'-------->'+Evaluado[m].nombre);
																						/*
																							mientras el valor guardado en el arreglo aleatorio[] sea igual en cualquiera
																							de sus tres posiciones se debe repetir el proceso de seleccion aleatoria 
																							hasta que este arreglo tenga valores diferentes en sus tres posiciones
																						*/
																						while((aleatorio[0] == aleatorio[1]) || (aleatorio[0] == aleatorio[2]) || (aleatorio[1] == aleatorio[0]) || (aleatorio[1] == aleatorio[2]) || (aleatorio[2] == aleatorio[0]) || (aleatorio[2] == aleatorio[1])) {
																							console.log('=============Cambiando==============');
																							aleatorio[n] = Evaluador[Math.floor(Math.random() * Evaluador.length)].cedula;
																							console.log('Evaluador: '+aleatorio[n] +'-------->'+Evaluado[m].nombre);															
																						}
																						/*
																							creamos una evaluacionUsuario en la DB
																							este proceso se repetira 3*m veces
																						*/
																						models.evaluacionUsuario.create({
																							calificacion: null,
																							status: false,
																							evaluacionId: Evaluaciones[3].id,
																							usuarioCedula: aleatorio[n],
																							usuarioEvaluado: Evaluado[m].cedula
																						});
																					}
																				})
																			}
																		});
																	}
																	//Si la evaluacion es de tipo Eval-Jefe (los Jefes evaluan a sus subordinados)
																	else if(Evaluaciones[i].instrument.tipoEvalId == 3) {
																		/*
																			Buscamos al jefe de la unidad que seleccionamos
																		*/
																		models.usuario.findOne({
																			where: {
																				[Op.and]: [
																					{nucleoCodigo:req.body.nucleo},
																					{unidadCodigo:req.body.unidad},
																					{cargoId:2},
																					{rolId:5}
																				]
																			}
																		}).then(Jefe => {
																			/*
																				Buscamos a todos los usuarios subordinados de la unidad seleccionada
																			*/
																			models.usuario.findAll({
																				where: { [Op.and]: [{nucleoCodigo:req.body.nucleo},
																					{unidadCodigo:req.body.unidad},
																					{cargoId:3},
																					{rolId:5}] 
																				}
																			}).then(Subordinado => {
																				/*
																					Hacemos un recorrido por todos los subordinados encontrados
																				*/
																				for(var z = 0; z < Subordinado.length; z ++) {
																					/*
																						se creara un registro en la tabla evaluacionUsuario z cantidad
																						de veces 
																					*/
																					models.evaluacionUsuario.create({
																						calificacion: null,
																						status: false,
																						evaluacionId: Evaluaciones[1].id,
																						usuarioCedula: Jefe.cedula,
																						usuarioEvaluado: Subordinado[z].cedula
																					})
																				}		
																			})
																		})
																	}
																	//Si la evaluacion es de tipo Eval-Subordinados (los subordinados Evaluan al Jefe)
																	else if(Evaluaciones[i].instrument.tipoEvalId == 4) {
																		/*
																			Buscamos a todos los subordinados del nucleo y unidad que ya 
																			seleccionamos 
																		*/
																		models.usuario.findAll({
																			where: { 
																				[Op.and]: [
																					{nucleoCodigo: req.body.nucleo},
																					{unidadCodigo: req.body.unidad},
																					{cargoId: 3},
																					{rolId: 5}
																				] 
																			}
																		}).then(Subordinado => {
																			/*
																				Buscamos al jefe de la unidad
																			*/
																			models.usuario.findOne({
																				where: {
																					[Op.and]: [
																								{nucleoCodigo: req.body.nucleo},
																								{unidadCodigo:req.body.unidad},
																								{cargoId:2},
																								{rolId:5}
																					]
																				}
																			}).then(Jefe => {
																				/*
																					Hacemos un recorrido por todos los subordinados encontrados
																				*/
																				for(let k = 0; k < Subordinado.length; k ++) {
																					/*
																						se creara un registro en la tabla evaluacionUsuario k cantidad
																						de veces 
																					*/
																					models.evaluacionUsuario.create({
																						calificacion: null,
																						status: false,
																						evaluacionId: Evaluaciones[2].id,
																						usuarioCedula: Subordinado[k].cedula,
																						usuarioEvaluado: Jefe.cedula
																					})	
																				}
																			})
																		})
																	}
																	//Si la evaluacion es de tipo AutoEvalJefe (autoEval de Jefe)
																	else if(Evaluaciones[i].instrument.tipoEvalId == 5) {
																		//hacemos un recorrido por todos los usuarios que encontramos
																		for(let j = 0; j < Usuario.length; j ++) {
																			// si el Usuario[j] tiene cargo 2 (Jefe)
																			if(Usuario[j].cargoId == 2) {
																				/*
																					se creara un registro en la tabla evaluacionUsuario j cantidad
																					de veces 
																				*/
																				models.evaluacionUsuario.create({
																					calificacion: null,
																					status: false,
																					evaluacionId: Evaluaciones[0].id,
																					usuarioCedula: Usuario[j].cedula,
																					usuarioEvaluado: Usuario[j].cedula
																				})
																			}
																		}
																	}
																}
																//Enviar Correo a todos los Usuarios de esta Unidad
																console.log("nodeMailerSample()");

																console.log("Creating transport...");
															    var transporter = nodemailer.createTransport({
															      service: 'gmail', //al usar un servicio bien conocido, no es necesario proveer un nombre de servidor.
															      auth: {
															        user: 'andresdlc56@gmail.com',
															        pass: 'Papa5088829'
															      }
															    });

															    //Enviar correo a todos los usuarios de esta unidad
																for(let i = 0; i < Usuario.length; i ++) {
																	var mailOptions = {
																      from: 'andresdlc56@gmail.com',
																      to: Usuario[i].email,
																      subject: 'Evaluación Planificada',
																      text: 'Hola '+Usuario[i].nombre+' Tienes una Evaluacion Asignada, para mas Información visita nuestra pagina: http://localhost:5000/login'
																    };

																    console.log("sending email", mailOptions);
																    transporter.sendMail(mailOptions, function (error, info) {
																      console.log("senMail returned!");
																      if (error) {
																        console.log("ERROR!!!!!!", error);
																      } else {
																        console.log('Email sent: ' + info.response);
																      }
																    });

																    console.log("End of Script");

																}
																req.flash('info', 'Evaluación planificada Exitosamente!');
																res.redirect('/coord_plani');
															})
														})
													})
												})
												

												
											})
										})
									})
								})
							})
						})
					})
				})
			} else {
				req.flash('error', 'Error! Esta Unidad no cuenta con Suficiente Personal ');
				res.redirect('/coord_plani/plani_eval');
			}
		});
	} else {
		//Buscar cuantos Usuarios tiene el Centro de Invest donde se planifico la eval
		models.usuario.findAll({
			where: { unidadCodigo: req.body.unidad }
		}).then(Usuarios => {
			if(Usuarios.length > 2) {
				//Buscar el Instrumento para la AutoEval del Jefe del centro de Inves
				models.instrument.findOne({
					where: {
						[Op.and]: [
							{tipoEvalId: 6},
							{categoriumId: 2} 
						] 
					}
				}).then(autoEvalJefeCentro => {
					models.evaluacion.create({
						nombre: req.body.nombre,
						categoriumId: req.body.categoria,
						nucleoCodigo: req.body.nucleo,
						fecha_i: req.body.fecha_i,
						fecha_f: req.body.fecha_f,
						unidadCodigo: req.body.unidad,
						instrumentId: autoEval.id
					}).then(seis => {
						//Buscar el Instrumento para la AutoEval del Subordi del centro de Inves
						models.instrument.findOne({
							where: {
								[Op.and]: [
									{tipoEvalId: 7},
									{categoriumId: 2} 
								] 
							}
						}).then(autoEvalSubordCentro => {
							models.evaluacion.create({
								nombre: req.body.nombre,
								categoriumId: req.body.categoria,
								nucleoCodigo: req.body.nucleo,
								fecha_i: req.body.fecha_i,
								fecha_f: req.body.fecha_f,
								unidadCodigo: req.body.unidad,
								instrumentId: autoEval.id
							}).then(siete => {
								//Buscar el Instrumento para Evaluar al Jefe del centro de Inves
								models.instrument.findOne({
									where: {
										[Op.and]: [
											{tipoEvalId: 8},
											{categoriumId: 2} 
										] 
									}
								}).then(Eval_a_JefeCentro => {
									models.evaluacion.create({
										nombre: req.body.nombre,
										categoriumId: req.body.categoria,
										nucleoCodigo: req.body.nucleo,
										fecha_i: req.body.fecha_i,
										fecha_f: req.body.fecha_f,
										unidadCodigo: req.body.unidad,
										instrumentId: autoEval.id
									}).then(ocho => {
										//Buscar el Instrumento para Evaluar a los subordi del centro de Inves
										models.instrument.findOne({
											where: {
												[Op.and]: [
													{tipoEvalId: 9},
													{categoriumId: 2} 
												] 
											}
										}).then(Eval_a_SubordCentro => {
											models.evaluacion.create({
												nombre: req.body.nombre,
												categoriumId: req.body.categoria,
												nucleoCodigo: req.body.nucleo,
												fecha_i: req.body.fecha_i,
												fecha_f: req.body.fecha_f,
												unidadCodigo: req.body.unidad,
												instrumentId: autoEval.id
											}).then(nueve => {

											})
										})
									})
								})
							})
						})
					})
				})
			} else {
				req.flash('error', 'Error! Este Centro de Investigación no cuenta con Suficiente Personal ');
				res.redirect('/coord_plani/plani_eval');
			}
		});
	}
}

exports.eval_encurso = function(req, res) {
	var usuario = req.user;
	var fecha_actual = new Date();
	/*
		Buscar todas las Evaluaciones donde la fecha_i <= fecha_actual
		y
		fecha_f >= fecha_actual
	*/
	models.evaluacion.findAll({
		include: [ models.instrument, models.nucleo, models.unidad ],
		where: {
			[Op.and]: {
				fecha_i: {
					[Op.lte]: fecha_actual
				},
				fecha_f: {
					[Op.gte]: fecha_actual
				},
				instrumentId: 1	
			}
		}
	}).then(Evaluacion => {
		res.render('coord_plani/evaluacion/eval_encurso', { 
			usuario,
			Evaluacion, 
			fecha_actual,
			message: req.flash('info') 
		});	
	});
}

exports.update_eval = function(req, res) {
	var idEval = parseInt(req.body.id);
 	
 	models.evaluacion.findAll({
 		where: {
 			[Op.and]: [
		      { id: [idEval, idEval+1, idEval+2, idEval+3] }
		    ]
 		}
 	}).then(Evaluaciones => {
 		for(let i = 0; i < Evaluaciones.length; i ++) {
 			models.evaluacion.update({
		 		fecha_f: req.body.fecha_f
		 	}, {
		 		where: { id: Evaluaciones[i].id }
		 	})
 		}
 		req.flash('info', 'Evaluacion Actualizada!');
		res.redirect('/coord_plani');
 	})
}

exports.eval_culminado = function(req, res) {
	var usuario = req.user;
	var fecha_actual = new Date();
	models.evaluacion.findAll({
		where: {
			fecha_f: {
				[Op.lt]: fecha_actual
			}
		}
	}).then(Evaluacion => {
		//res.send(Evaluacion);
		res.render('coord_plani/evaluacion/eval_culminado', { Evaluacion, usuario });
	});
}

exports.deleteEval = function(req, res) {
	var id = parseInt(req.params.id);
	models.evaluacion.destroy({
        where: {
          id: req.params.id
        }
    }).then(EvaluacionA => {
    	models.evaluacion.destroy({
	        where: {
	          id: id + 1
	        }
	    }).then(EvaluacionB => {
	    	models.evaluacion.destroy({
		        where: {
		          id: id + 2
		        }
		    }).then(EvaluacionC => {
		    	models.evaluacion.destroy({
			        where: {
			          id: id + 3
			        }
			    }).then(EvalucionD => {
					req.flash('error', 'Evaluación Eliminada Exitosamente!');
          			res.redirect('/coord_plani');	    		
			    });	
		    });	
	    });		
    });
}

exports.editEval = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad, models.rol ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		models.evaluacion.findOne({
			include: [ models.nucleo, models.unidad ],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			models.nucleo.findAll({

			}).then(Nucleos => {
				res.render('coord_plani/evaluacion/editar', { Evaluacion, Nucleos, Usuario });
			})
		});
	});
}

exports.getNucleos = function(req, res) {
	models.nucleo.findAll({
		where: {
			categoriumId: req.params.categoriaId
		}
	}).then(Nucleos => {
		res.json(Nucleos);
	}).catch(err => {
		console.log(err);
	})
}

/*
exports.getUnidades = function(req, res) {
	models.unidad.findAll({
		where: { 
			[Op.and]: [
				{categoriumId: req.params.categoriaId},
				{nucleoCodigo: req.params.id} 
			] 
		}
	}).then(Unidades => {
		res.json(Unidades)
	}).catch(err => {
		res.json(err);
	})
}
*/

exports.verTodas = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad, models.rol ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('coord_plani/evaluacion/evaluacionesTodas', { Usuario });
	})
}

//=================Controladores para Axios============
//controlador para verificar que todos los instrumentos de evaluaciones esten disponibles
exports.getInstrumentos = function(req, res) {
 	models.instrument.findOne({
 		where: { tipoEvalId: 1 }
 	}).then(autoEval => {
 		models.instrument.findOne({
 			where: { tipoEvalId: 2 }
 		}).then(coEval => {
 			models.instrument.findOne({
 				where: { tipoEvalId: 3 }
 			}).then(eval_a_jefe => {
 				models.instrument.findOne({
 					where: { tipoEvalId: 4 }
 				}).then(eval_a_subor => {
 					models.instrument.findOne({
 						where: { tipoEvalId: 5 }
 					}).then(autoEvalJefe => {
 						models.instrument.findOne({
 							where: { tipoEvalId: 6 }
 						}).then(autoEvalCentroJefe => {
 							models.instrument.findOne({
 								where: { tipoEvalId: 7 }
 							}).then(autoEvalCentroSubor => {
 								models.instrument.findOne({
 									where: { tipoEvalId: 8 }
 								}).then(eval_a_jefeCentro => {
 									models.instrument.findOne({
 										where: { tipoEvalId: 9 }
 									}).then(eval_a_suborCentro => {
 										var Instrumentos = false;
					 					if((!autoEval || !coEval || !eval_a_jefe || !eval_a_subor || !autoEvalJefe || !autoEvalCentroJefe || !autoEvalCentroSubor || !eval_a_jefeCentro || !eval_a_suborCentro)) {
					 						res.json(Instrumentos);
					 					} else {
					 						Instrumentos = true
					 						res.json(Instrumentos);
					 					}
 									})
 								})	
 							})							
 							
 						})	
 					})
 				}).catch(err => {
 					console.log(err)
 				})
 			})
 		})
 	})
}

exports.getEvaluacion = function(req, res) {
 	models.evaluacion.findOne({
 		include: [ models.nucleo, models.unidad ],
 		where: { id: req.params.id }
 	}).then(Evaluacion => {
 		res.json(Evaluacion);
 	}).catch(err => {
 		console.log(err);
 	})
}

/*
exports.getNucleos = function(req, res) {
 	models.nucleo.findAll({

 	}).then(Nucleos => {
 		res.json(Nucleos);
 	}).catch(err => {
 		res.json(err);
 	})
}
*/

exports.getUnidades = function(req, res) {
 	models.unidad.findAll({
 		where: {
 			[Op.and]: [
				{categoriumId: req.params.categoriaId},
				{nucleoCodigo: req.params.id} 
			] 
 		}
 	}).then(Unidades => {
 		res.json(Unidades);
 	}).catch(err => {
 		res.json(err);
 	})
}

exports.actualizaEval = function(req, res) {
 	var idEval = parseInt(req.params.id);
 	console.log(typeof(idEval))
 	models.evaluacion.findAll({
 		where: {
 			[Op.and]: [
		      { id: [idEval, idEval+1, idEval+2, idEval+3] }
		    ]
 		}
 	}).then(Evaluaciones => {
 		for(let i = 0; i < Evaluaciones.length; i ++) {
 			models.evaluacion.update({
		 		nucleoCodigo: req.body.nucleo,
		 		unidadCodigo: req.body.unidad,
		 		fecha_i: req.body.fecha_i,
		 		fecha_f: req.body.fecha_f
		 	}, {
		 		where: { id: Evaluaciones[i].id }
		 	})
 		}
 		req.flash('info', 'Evaluacion Actualizada!');
		res.redirect('/coord_plani');
 	})
}

exports.getEvaluacionesTodas = function(req, res) {
	models.evaluacion.findAll({
		include: [ models.nucleo, models.unidad ],
		where: { instrumentId: 1 }
	}).then(Evaluaciones => {
		res.json(Evaluaciones);
	}).catch(err => {
		res.json(err);
	});
}

exports.actualizarDatos = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('coord_plani/perfil/actualizar', { 
			Usuario,
			message: req.flash('err')
		});
	})
}

exports.getUsuario = function(req, res) {
	models.usuario.findOne({
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.json(Usuario)
	}).catch(err => {
		res.json(err)
	});
}

exports.updateDatos = function(req, res) {
	models.usuario.update({
		email: req.body.email
	},{
		where: { cedula: req.user.cedula }
	}).then(Actualizado => {
		req.flash('info', 'Datos Actualizados!');
		res.redirect('/coord_plani');
	}).catch(err => {
		res.send('error');
	});
}

exports.passwordUpdate = function(req, res) {
	console.log('===========passwordUpdate============');
	
	var isValidPassword = function(userpass, password) { 
    	return bCrypt.compareSync(password, userpass);
    }

    var password = req.body.password;
    var newPass = req.body.newPassword;

	models.usuario.findOne({
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		var tipoPass = typeof(password);
		var passDB = typeof(Usuario.password);

		if(isValidPassword(Usuario.password, password)) {
			var newContrasena = bCrypt.hashSync(newPass, bCrypt.genSaltSync(8), null);

			models.usuario.update({
				password: newContrasena
			}, {
				where: { cedula: req.user.cedula }
			}).then(Actualizado => {
				res.redirect('/logout');
			}).catch(err => {
				console.log(err);
			})
		}

		else {
			console.log('Password Incorecto');
			req.flash('err', 'Contraseña Actual Incorrecta!');
			res.redirect('/coord_plani/actualizarDatos');
		}
	})
}

exports.agergarNoticias = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad, models.rol ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		res.render('coord_plani/noticias/agregar', { 
			Usuario 
		});	
	})
}

exports.addNoticia = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/noticias',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('urlImg');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /jpeg|jpg|png|gif/;
		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			console.log('error');
			res.send('algun error')
		} else{
			if(req.file == undefined){
				console.log(req.file);
				res.send('indefinido')
			} else{
				console.log(req.file.filename);
				models.noticia.create({
					titulo: req.body.titulo,
					resumen: req.body.resumen,
					descripcion: req.body.descripcion,
					urlImg: req.file.filename
				}).then(Noticia => {
					console.log('Noticia agregada exitosamente');
					res.redirect('/coord_plani/agregarNoticias');
				})
			}
		}
	});
}

exports.verNoticia = function(req, res) {
	var sesion = true;

	models.noticia.findOne({
		where: { id: req.params.id }
	}).then(Noticia => {
		models.usuario.findOne({
			include: [ models.nucleo, models.unidad, models.rol ],
			where: { cedula: req.user.cedula }
		}).then(Usuario => {
			res.render('coord_plani/noticias/verNoticia', { Noticia, sesion, Usuario });	
		})
	})
}

exports.editNoticia = function(req, res) {
	var sesion = true;

	models.noticia.findOne({
		where: { id: req.params.id }
	}).then(Noticia => {
		models.usuario.findOne({
			include: [ models.nucleo, models.unidad, models.rol ],
			where: { cedula: req.user.cedula }
		}).then(Usuario => {
			res.render('coord_plani/noticias/edit', { Noticia, sesion, Usuario });	
		})
	})
}

exports.getNoticia = function(req, res) {
	models.noticia.findOne({
		where: { id: req.params.id }
	}).then(Noticia => {
		res.json(Noticia);
	}).catch(err => {
		res.json(err)
	})
}

exports.updateNoticia = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/noticias',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('urlImg');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /jpeg|jpg|png|gif/;

		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			console.log('error');
			res.send('algun error')
		} else{
			if(req.file == undefined){
				models.noticia.update({
					titulo: req.body.titulo,
					resumen: req.body.resumen,
					descripcion: req.body.descripcion
				}, {
					where: {
						id: req.body.id
					}
				}).then(Evento => {
					console.log('=========Noticia Editada Sin Img============');
					
					res.redirect('/coord_plani');
				})
				console.log(req.file);
			} else{
				models.noticia.update({
					titulo: req.body.titulo,
					resumen: req.body.resumen,
					descripcion: req.body.descripcion,
					urlImg: req.file.filename
				}, {
					where: {
						id: req.body.id
					}
				}).then(Evento => {
					console.log('============Noticia Editada Con Img==============');
					
					res.redirect('/coord_plani')
				}).catch(err => {
					console.log(err)
				});
			}
		}
	})
}

exports.getCategorias = function(req, res) {
	models.categoria.findAll({

	}).then(Categorias => {
		res.json(Categorias);
	}).catch(err => {
		res.json(err);
	});
}