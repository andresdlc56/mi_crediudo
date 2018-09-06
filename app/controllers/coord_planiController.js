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
	//creando una nueva evaluación 
	models.evaluacion.create({
		nombre: undefined,
		categoriumId: req.body.categoria,
		nucleoCodigo: req.body.nucleo,
		fecha_i: undefined,
		fecha_f: undefined,
		unidadCodigo: undefined
	}).then(Evaluacion => {
		//buscando la evaluacion recien creada
		models.evaluacion.findById(Evaluacion.id).then(Evaluacion => {
			res.redirect('/coord_plani/plani_eval/'+Evaluacion.id+'/n/'+Evaluacion.nucleoCodigo);
		})
	});
}

exports.addEval_b = function(req, res) {
	//buscando todas las unidades pertenecientes al nucleo que elejimos anteriormente
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
	//actualizando una evalucion donde su id sea igual al id que viene por parametro
	models.evaluacion.update({
		nombre: req.body.nombre,
		fecha_i: req.body.fecha_i,
		fecha_f: req.body.fecha_f,
		unidadCodigo: req.body.unidad,
		instrumentId: req.body.instrumento
	},{
		where: {
			id: req.params.id
		}
	}).then(Evaluacion => {
		//buscar todos los usuarios que cumplan con los siguientes parametros 
		models.usuario.findAll({
			where: { [Op.and]: [{nucleoCodigo:req.params.idn}, {unidadCodigo:req.body.unidad}] }
		}).then(Usuario => {
			//buscar todas las evaluaciones que cumpla con los siguientes parametros 
			models.evaluacion.findAll({
				include: [models.instrument],
				where: { [Op.and]: [
					{nucleoCodigo: req.params.idn}, 
					{unidadCodigo:req.body.unidad}, 
					{instrumentId: req.body.instrumento}] 
				}
			}).then(Evaluaciones => {
				for(var j = 0; j < Evaluaciones.length; j ++){
					//Si la evaluacion es de tipo Auto-Eval
					if(Evaluaciones[j].instrument.tipoEvalId == 1) {
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
					else if(Evaluaciones[j].instrument.tipoEvalId == 4) {
						
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
					else if(Evaluaciones[j].instrument.tipoEvalId == 3) {

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
					else if(Evaluaciones[j].instrument.tipoEvalId == 2) {
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
				}
				//res.send(Resto);
				req.flash('info', 'Evaluación planificada Exitosamente!');
				res.redirect('/coord_plani');
			});	
		});
	});
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