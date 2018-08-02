var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.index = function(req, res) {
	models.evaluacion.findAll({
		include: [models.categoria, models.nucleo, models.unidad, models.instrument],
	}).then(Evaluaciones => {
		models.tipoEval.findAll({

		}).then(tipoEval => {
			//res.send(Evaluaciones);
			res.render('coord_plani/index', { Evaluaciones, tipoEval });	
		});
	});
}

exports.planiEval = function(req, res) {
	models.categoria.findAll({

	}).then(Categorias => {
		models.nucleo.findAll({

		}).then(Nucleos => {
			res.render('coord_plani/evaluacion/planificar', { Categorias, Nucleos });	
		});
	});
}

exports.addEval = function(req, res) {
	models.evaluacion.create({
		nombre: undefined,
		categoriumId: req.body.categoria,
		nucleoCodigo: req.body.nucleo,
		fecha_i: undefined,
		fecha_f: undefined,
		unidadCodigo: undefined
	}).then(Evaluacion => {
		models.evaluacion.findById(Evaluacion.id).then(Evaluacion => {
			res.redirect('/coord_plani/plani_eval/'+Evaluacion.id+'/n/'+Evaluacion.nucleoCodigo);
			//res.send(Evaluacion);	
		})
	});
}

exports.addEval_b = function(req, res) {
	models.unidad.findAll({
		where: { nucleoCodigo: req.params.idn }
	}).then(Unidades => {
		models.evaluacion.findById(req.params.id).then(Evaluacion => {
			models.nucleo.findById(req.params.idn).then(Nucleo => {
				models.instrument.findAll({
					where: { categoriumId: Evaluacion.categoriumId }
				}).then(Instrumentos => {
					//res.send(Instrumentos);
					res.render('coord_plani/evaluacion/planificar_b', { Unidades, Evaluacion, Nucleo, Instrumentos });
				})	
			});
		});
	});
}


exports.finiquitarEval = function(req, res) {
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
				//res.redirect('/coord_plani');
			});	
		});
	});
}