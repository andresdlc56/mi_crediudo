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

/*
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
		models.usuario.findAll({
			where: { [Op.and]: [{nucleoCodigo:req.params.idn}, {unidadCodigo:req.body.unidad}] }
		}).then(Usuario => {
			for(var i = 0; i < Usuario.length; i ++) {
				models.evaluacionUsuario.create({
					calificacion: null,
					status: false,
					evaluacionId: req.params.id,
					usuarioCedula: Usuario[i].cedula
				});
			}
			res.redirect('/coord_plani');	
		});

	});
}*/

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
		models.usuario.findAll({
			where: { [Op.and]: [{nucleoCodigo:req.params.idn}, {unidadCodigo:req.body.unidad}] }
		}).then(Usuario => {
			models.evaluacion.findAll({
				include: [models.instrument],
			}).then(Evaluaciones => {
				for(var i = 0; i < Usuario.length; i ++) {
					for(var j = 0; j < Evaluaciones.length; j ++) {
						//Evaluacion solo disponible para usuarios Jefe-Subordinado 
						if((Usuario[i].cargoId == 2 || Usuario[i].cargoId == 3) && (Evaluaciones[j].instrument.tipoEvalId == 3 || Evaluaciones[j].instrument.tipoEvalId == 2 || Evaluaciones[j].instrument.tipoEvalId == 4)) {
							models.evaluacionUsuario.create({
								calificacion: null,
								status: false,
								evaluacionId: req.params.id,
								usuarioCedula: Usuario[i].cedula
							});
						//Evaluacion solo disponible para usuarios Jefe-Subordinado 
						}  if((Usuario[i].cargoId == 2) && Evaluaciones[j].instrument.tipoEvalId == 4) {
							models.evaluacionUsuario.create({
								calificacion: null,
								status: false,
								evaluacionId: req.params.id,
								usuarioCedula: Usuario[i].cedula
							});
						//Evaluacion solo disponible para usuarios Jefe-Subordinado o Subordinado
						}  if((Usuario[i].cargoId == 2  || Usuario[i].cargoId == 3) && Evaluaciones[j].instrument.tipoEvalId == 1) {
							models.evaluacionUsuario.create({
								calificacion: null,
								status: false,
								evaluacionId: req.params.id,
								usuarioCedula: Usuario[i].cedula
							});
						//Evaluacion solo disponible para usuarios subordinados	
						} if((Usuario[i].cargoId == 3) && (Evaluaciones[j].instrument.tipoEvalId == 1 || Evaluaciones[j].instrument.tipoEvalId == 2 || Evaluaciones[j].instrument.tipoEvalId == 4)) {
							models.evaluacionUsuario.create({
								calificacion: null,
								status: false,
								evaluacionId: req.params.id,
								usuarioCedula: Usuario[i].cedula
							});
						} 
					}
				}
				res.redirect('/coord_plani');
			});	
		});
	});
}