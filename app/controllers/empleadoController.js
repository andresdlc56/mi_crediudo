var exports = module.exports = {}

var models = require('../models');

exports.evaluacion = function(req, res) {
	models.usuario.findById(req.params.idu).then(Usuario => {
		models.evaluacion.findOne({
			include: [models.instrument],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			models.instrumentFactor.findAll({
				include: [models.factor],
				where: { instrumentId: Evaluacion.instrumentId }
			}).then(instrumentFactor => {
				models.item.findAll({
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Items => {
					if (Usuario.nucleoCodigo == Evaluacion.nucleoCodigo && Usuario.unidadCodigo == Evaluacion.unidadCodigo) {
						//res.send(Items);
						res.render('empleado/evaluacion/index', { Usuario, Evaluacion, instrumentFactor, Items });	
					} else{
						res.send('Negativo');
					}	
				})
			})
		})
	})
}

exports.procesarEval = function(req, res) {
	var factores = req.body.factores;
	var items = req.body.items;
	var total = {};
	var variable = 'item';

	for(var i = 0; i < items; i ++){
		total[ variable + i ] = req.body.item_1;
	};

	res.send(total);
}