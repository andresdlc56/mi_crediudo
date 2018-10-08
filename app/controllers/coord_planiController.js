var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
	var usuario = req.user;
	//buscando todas las evalucaiones 
	models.evaluacion.findAll({
		include: [models.categoria, models.nucleo, models.unidad, models.instrument],
	}).then(Evaluaciones => {
		//buscando todos los tipos de valuaciones
		models.tipoEval.findAll({

		}).then(tipoEval => {
			res.render('coord_plani/index', { 
				Evaluaciones, 
				tipoEval,
				usuario,
				message: req.flash('info')
			});	
		});
	});
}

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
	if(req.body.categoria == 2) {
		//creando una nueva evaluación 
		models.evaluacion.create({
			nombre: req.body.nombre,
			categoriumId: req.body.categoria,
			nucleoCodigo: req.body.nucleo,
			fecha_i: req.body.fecha_i,
			fecha_f: req.body.fecha_f,
			unidadCodigo: undefined,
			instrumentId: 4
		}).then(autoEval => {
			models.evaluacion.create({
				nombre: req.body.nombre,
				categoriumId: req.body.categoria,
				nucleoCodigo: req.body.nucleo,
				fecha_i: req.body.fecha_i,
				fecha_f: req.body.fecha_f,
				unidadCodigo: undefined,
				instrumentId: 3
			}).then(coEval => {
				models.evaluacion.create({
					nombre: req.body.nombre,
					categoriumId: req.body.categoria,
					nucleoCodigo: req.body.nucleo,
					fecha_i: req.body.fecha_i,
					fecha_f: req.body.fecha_f,
					unidadCodigo: undefined,
					instrumentId: 2
				}).then(evalJefe => {
					models.evaluacion.create({
						nombre: req.body.nombre,
						categoriumId: req.body.categoria,
						nucleoCodigo: req.body.nucleo,
						fecha_i: req.body.fecha_i,
						fecha_f: req.body.fecha_f,
						unidadCodigo: undefined,
						instrumentId: 1
					}).then(evalSubor => {
						//buscando la evaluacion recien creada
						models.evaluacion.findById(autoEval.id).then(Evaluacion => {
							//res.send(Evaluacion);
							res.redirect('/coord_plani/plani_eval/'+Evaluacion.id+'/n/'+Evaluacion.nucleoCodigo);
						});			
					});
				});	
			});
		});
	} else {
		res.send("Evaluacion a Centro de Investigacion");
	}
}

exports.addEval_b = function(req, res) {
	//buscando todas las unidades pertenecientes al nucleo que elegimos anteriormente
	models.unidad.findAll({
		where: { nucleoCodigo: req.params.idn }
	}).then(Unidades => {
		//buscando una evaluacion especifica 
		models.evaluacion.findById(req.params.id).then(Evaluacion => {
			//buscando un nucleo en especifico 
			models.nucleo.findById(req.params.idn).then(Nucleo => {
				/*
				buscando todos los instrumentos donde la categoria sea igual a la que elejimos 
				en el controlador anterior
				*/ 
				models.instrument.findAll({
					where: { categoriumId: Evaluacion.categoriumId }
				}).then(Instrumentos => {
					res.render('coord_plani/evaluacion/planificar_b', { Unidades, Evaluacion, Nucleo, Instrumentos });
				})	
			});
		});
	});
}

exports.finiquitarEval = function(req, res) {
	var idB = parseInt(req.params.id) + 1;
	var idC = parseInt(req.params.id) + 2;
	var idD = parseInt(req.params.id) + 3;

	models.evaluacion.update({
		unidadCodigo: req.body.unidad
	},{
		where: {
			id: req.params.id
		}
	}).then(Evaluacion_A => {
		models.evaluacion.update({
			unidadCodigo: req.body.unidad
		},{
			where: {
				id: idB
			}
		}).then(Evaluacion_B => {
			models.evaluacion.update({
				unidadCodigo: req.body.unidad
			},{
				where: {
					id: idC
				}
			}).then(Evaluacion_C => {
				models.evaluacion.update({
					unidadCodigo: req.body.unidad
				},{
					where: {
						id: idD
					}
				}).then(Evaluacion_D => {
					res.send("Evaluacion Actualizadas");
				})
			})
		})	
	})

	//actualizando una evalucion donde su id sea igual al id que viene por parametro
	/*
	models.evaluacion.update({
		unidadCodigo: req.body.unidad
	},{
		where: {
			id: req.params.id
		}
	}).then(Evaluacion => {
		//buscar todos los usuarios que cumplan con los siguientes parametros
			
				que todos pertenecescan al nucleo q viene por parametro 
				y
				que pertenescan a la unidad seleccionada en la pantalla anterior 
			 
		models.usuario.findAll({
			where: { [Op.and]: [{nucleoCodigo:req.params.idn}, {unidadCodigo:req.body.unidad}] }
		}).then(Usuario => {
			//buscar todas las evaluaciones que cumpla con los siguientes parametros 
			models.evaluacion.findOne({
				include: [models.instrument],
				where: { 
						[Op.and]: [
							{nucleoCodigo: req.params.idn}, 
							{unidadCodigo:req.body.unidad}, 
							{instrumentId: req.body.instrumento}
						] 
				}
			}).then(Evaluaciones => {
					//Si la evaluacion es de tipo Auto-Eval
					if(Evaluaciones.instrument.tipoEvalId == 1) {
						for(var i = 0; i < Usuario.length; i ++) {
							models.evaluacionUsuario.create({
								calificacion: null,
								status: false,
								evaluacionId: req.params.id,
								usuarioCedula: Usuario[i].cedula,
								usuarioEvaluado: Usuario[i].cedula
							})
						}
					} 
					//Si la evaluacion es de tipo Eval-Jefe
					else if(Evaluaciones.instrument.tipoEvalId == 4) {
						
						models.usuario.findAll({
							where: { [Op.and]: [{nucleoCodigo:req.params.idn},
								{unidadCodigo:req.body.unidad},
								{cargoId:3},
								{rolId:5}] 
							}
						}).then(Subordinado => {
							//res.send(Evaluaciones);
							models.usuario.findOne({
								where: {
									[Op.and]: [
												{nucleoCodigo:req.params.idn},
												{unidadCodigo:req.body.unidad},
												{cargoId:2},
												{rolId:5}
									]
								}
							}).then(Jefe => {

								for(var k = 0; k < Subordinado.length; k ++) {
									models.evaluacionUsuario.create({
										calificacion: null,
										status: false,
										evaluacionId: req.params.id,
										usuarioCedula: Subordinado[k].cedula,
										usuarioEvaluado: Jefe.cedula
									})	
								}
							})
						})
					} 
					//Si la evaluacion es de tipo Eval-subor
					else if(Evaluaciones.instrument.tipoEvalId == 3) {

						models.usuario.findOne({
							where: {
								[Op.and]: [
									{nucleoCodigo:req.params.idn},
									{unidadCodigo:req.body.unidad},
									{cargoId:2},
									{rolId:5}
								]
							}
						}).then(Jefe => {
							models.usuario.findAll({
								where: { [Op.and]: [{nucleoCodigo:req.params.idn},
									{unidadCodigo:req.body.unidad},
									{cargoId:3},
									{rolId:5}] 
								}
							}).then(Subordinado => {

								for(var z = 0; z < Subordinado.length; z ++) {
									models.evaluacionUsuario.create({
										calificacion: null,
										status: false,
										evaluacionId: req.params.id,
										usuarioCedula: Jefe.cedula,
										usuarioEvaluado: Subordinado[z].cedula
									})
								}		
							})
						})
					}
					//Si la evaluacion es de tipo Co-Eval
					else if(Evaluaciones.instrument.tipoEvalId == 2) {
						models.usuario.findAll({
							where: {
								[Op.and]: [
									{nucleoCodigo:req.params.idn},
									{unidadCodigo:req.body.unidad},
									{cargoId:3},
									{rolId:5}
								]
							}
						}).then(Todos => {
							for(let i = 0; i < Todos.length; i ++) {
								models.usuario.findAll({
									where: {
										[Op.and]: [
											{nucleoCodigo:req.params.idn},
											{unidadCodigo:req.body.unidad},
											{cargoId:3},
											{rolId:5},
											{cedula: { [Op.ne]: Todos[i].cedula }}
										]
									}
								}).then(Resto => {
									for(let j = 0; j < Resto.length; j ++) {
										models.evaluacionUsuario.create({
											calificacion: null,
											status: false,
											evaluacionId: req.params.id,
											usuarioCedula: Todos[i].cedula,
											usuarioEvaluado: Resto[j].cedula 
										});
									}
								});
							}
						})
					}
				
				//res.send(Evaluaciones);
				req.flash('info', 'Evaluación planificada Exitosamente!');
				res.redirect('/coord_plani');
			});	
		});
	});
	*/
}

exports.eval_encurso = function(req, res) {
	var usuario = req.user;
	var fecha_actual = new Date();
	models.evaluacion.findAll({
		where: {
			[Op.and]: {
				fecha_i: {
					[Op.lte]: fecha_actual
				},
				fecha_f: {
					[Op.gte]: fecha_actual
				}	
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