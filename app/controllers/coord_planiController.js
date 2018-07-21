var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
	res.render('coord_plani/index');
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
		fecha_f: undefined
	}).then(Evaluacion => {
		res.send('primera parte lista');
	});
}