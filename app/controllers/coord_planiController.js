var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
	models.evaluacion.findAll({
		include: [models.categoria, models.nucleo, models.unidad],
	}).then(Evaluaciones => {
		//res.send(Evaluaciones);
		res.render('coord_plani/index', { Evaluaciones });	
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
		res.redirect('/coord_plani');
		//res.send('primera parte lista');
	});
}