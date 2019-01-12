var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

//================Controlador Inicial Coord Planificación =============
exports.index = function(req, res) {
	var usuario = req.user;
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
			//res.send(Evaluaciones);
			res.render('coord_plani/index', { 
				Evaluaciones, 
				tipoEval,
				usuario,
				message: req.flash('info'),
        		error: req.flash('error')
			});	
		});
	});
}

//===============Controlador para Mostrar Formulario de planificación de Evaluacion====
exports.planiEval = function(req, res) {
	//buscando todas las categorias
	models.categoria.findAll({

	}).then(Categorias => {
		//buscando todos los nucleos
		models.nucleo.findAll({

		}).then(Nucleos => {
			res.render('coord_plani/evaluacion/planificar', { Categorias, Nucleos });	
		});
	});
}

exports.addEval = function(req, res) {
	//Si la categoria es 2 (Personal Administrativo)
	if(req.body.categoria == 2) {
		//creando una nueva evaluación 
		models.evaluacion.create({
			nombre: req.body.nombre,
			categoriumId: req.body.categoria,
			nucleoCodigo: req.body.nucleo,
			fecha_i: req.body.fecha_i,
			fecha_f: req.body.fecha_f,
			unidadCodigo: req.body.unidad,
			instrumentId: 4
		}).then(autoEval => {
			//creando una nueva evaluación CoEval
			models.evaluacion.create({
				nombre: req.body.nombre,
				categoriumId: req.body.categoria,
				nucleoCodigo: req.body.nucleo,
				fecha_i: req.body.fecha_i,
				fecha_f: req.body.fecha_f,
				unidadCodigo: req.body.unidad,
				instrumentId: 3
			}).then(coEval => {
				//creando una nueva evaluación evalJefe
				models.evaluacion.create({
					nombre: req.body.nombre,
					categoriumId: req.body.categoria,
					nucleoCodigo: req.body.nucleo,
					fecha_i: req.body.fecha_i,
					fecha_f: req.body.fecha_f,
					unidadCodigo: req.body.unidad,
					instrumentId: 2
				}).then(evalJefe => {
					//creando una nueva evaluación evalSubor
					models.evaluacion.create({
						nombre: req.body.nombre,
						categoriumId: req.body.categoria,
						nucleoCodigo: req.body.nucleo,
						fecha_i: req.body.fecha_i,
						fecha_f: req.body.fecha_f,
						unidadCodigo: req.body.unidad,
						instrumentId: 1
					}).then(evalSubor => {
						/*
							Busca las ultimas 4 evaluaciones creadas
						*/
						models.evaluacion.findAll({
							include: [models.instrument],
							limit: 4,
							order: [
								['id', 'DESC']
							]
						}).then(Evaluaciones => {
							models.usuario.findAll({
								where: { 
									[Op.and]: [
										{nucleoCodigo:req.body.nucleo}, 
										{unidadCodigo:req.body.unidad}
									] 
								}
							}).then(Usuario => {
								for(let i = 0; i < Evaluaciones.length; i ++) {
									//Si la evaluacion es de tipo Auto-Eval
									if(Evaluaciones[i].instrument.tipoEvalId == 1) {
										//hacemos un recorrido por todos los usuarios que encontramos 
										for(let j = 0; j < Usuario.length; j ++) {
											/*
												se creara un registro en la tabla evaluacionUsuario j cantidad
												de veces 
											*/
											models.evaluacionUsuario.create({
												calificacion: null,
												status: false,
												evaluacionId: Evaluaciones[3].id,
												usuarioCedula: Usuario[j].cedula,
												usuarioEvaluado: Usuario[j].cedula
											})
										}
									}
									//Si la evaluacion es de tipo Eval-Jefe (los subordinados Evaluan al Jefe)
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
														evaluacionId: Evaluaciones[1].id,
														usuarioCedula: Subordinado[k].cedula,
														usuarioEvaluado: Jefe.cedula
													})	
												}
											})
										})
									}
									//Si la evaluacion es de tipo Eval-subor (los Jefes evaluan a sus subordinados)
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
														evaluacionId: Evaluaciones[0].id,
														usuarioCedula: Jefe.cedula,
														usuarioEvaluado: Subordinado[z].cedula
													})
												}		
											})
										})
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
														while((aleatorio[0] == aleatorio[1]) || (aleatorio[0] == aleatorio[2]) || (aleatorio[1] == aleatorio[2])) {
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
															evaluacionId: Evaluaciones[2].id,
															usuarioCedula: Evaluador[n].cedula,
															usuarioEvaluado: Evaluado[m].cedula
														});
													}
												})
											}
										});
									}
								}
								//res.send("Listo");
								req.flash('info', 'Evaluación planificada Exitosamente!');
								res.redirect('/coord_plani');
							})
						})		
					});
				});	
			});
		});
	} else {
		res.send("Evaluacion a Centro de Investigacion");
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
	models.evaluacion.update({
		fecha_f: req.body.fecha_f
	}, {
		where: {
			[Op.or]: [
				{id: req.body.id}, 
				{id: parseInt(req.body.id) - 1}, 
				{id: parseInt(req.body.id) - 2}, 
				{id: parseInt(req.body.id) - 3}
			]
		}
	}).then(Eval => {
		req.flash('info', 'Fecha de Culminacion Actualizada!');
		res.redirect('/coord_plani/eval_encurso');
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
	          id: id - 1
	        }
	    }).then(EvaluacionB => {
	    	models.evaluacion.destroy({
		        where: {
		          id: id - 2
		        }
		    }).then(EvaluacionC => {
		    	models.evaluacion.destroy({
			        where: {
			          id: id - 3
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
	models.evaluacion.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { id: req.params.id }
	}).then(Evaluacion => {
		models.nucleo.findAll({

		}).then(Nucleos => {
			res.render('coord_plani/evaluacion/editar', { Evaluacion, Nucleos });
		})
	});
}

exports.getNucleos = function(req, res) {
	models.nucleo.findAll({

	}).then(Nucleos => {
		res.json(Nucleos);
	})
}

exports.getUnidades = function(req, res) {
	models.unidad.findAll({
		where: { nucleoCodigo: req.params.id }
	}).then(Unidades => {
		res.json(Unidades)
	})
}

 //=================Controladores para Axios============
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
 					var Instrumentos = false;

 					if((!autoEval || !coEval || !eval_a_jefe || eval_a_subor)) {
 						res.json(Instrumentos);
 					} else {
 						Instrumentos = true
 						res.json(Instrumentos);
 					}
 				}).catch(err => {
 					console.log(err)
 				})
 			})
 		})
 	})
 }