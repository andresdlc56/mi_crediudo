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
	var items = req.body.items; //esta siendo tratado como un string
	var acomulador = 0;

	var arreglo = [];

	//arreglo = req.body.item[];

	var isNumber = parseInt(items);

	//var itemIsNumber = parseInt(item[]);

	var tipo = typeof(req.body.item);

	for(var i = 0; i < isNumber; i ++){
		arreglo[i] = parseInt(req.body.item[i]);
		acomulador = acomulador + arreglo[i];
	}
	
	//res.send(req.body.item[0] + req.body.item[1]);
	
	console.log(isNumber);
	console.log(tipo);
	console.log(acomulador);
	//res.send(isNumber);
	res.render('empleado/evaluacion/finalizado', { isNumber })
}