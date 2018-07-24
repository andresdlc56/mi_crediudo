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
	var items = parseInt(req.body.items); //esta siendo tratado como un string

	
	var item = [];
	var acomulador = 0;

	for(var i = 0; i < items.length; i ++) {
		acomulador = acomulador + req.body.item[i];
	}
	
	//res.send(req.body.item[0] + req.body.item[1]);
	res.send(items);
	
}