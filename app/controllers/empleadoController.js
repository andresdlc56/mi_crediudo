var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

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
					models.evaluacionUsuario.findOne({
						where: { [Op.and]: [{usuarioCedula: req.params.idu}, {evaluacionId:req.params.id}] }
					}).then(evaluacionUsuario => {
						models.usuario.findById(evaluacionUsuario.usuarioEvaluado).then(usuarioEvaluado => {
							if (Usuario.nucleoCodigo == Evaluacion.nucleoCodigo && Usuario.unidadCodigo == Evaluacion.unidadCodigo) {
								//res.send(Items);
								res.render('empleado/evaluacion/index', { 
									Usuario, 
									Evaluacion, 
									instrumentFactor, 
									Items,
									evaluacionUsuario,
									usuarioEvaluado 
								});	
							} else{
								res.send('Negativo');
							}	
						})
					})
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
	var factorNumber = parseInt(factores);

	//var itemIsNumber = parseInt(item[]);

	var tipo = typeof(req.body.item);
	var tipoFactor = typeof(factores);

	for(var i = 0; i < isNumber; i ++){
		arreglo[i] = parseInt(req.body.item[i]);
		acomulador = acomulador + arreglo[i];
	}
	
	//res.send(req.body.item[0] + req.body.item[1]);
	
	var calificacion = acomulador/isNumber;

	models.evaluacionUsuario.update({
		calificacion: calificacion,
		status: true
	}, {
		where: { [Op.and]: [{usuarioCedula: req.params.idu}, {evaluacionId:req.params.id}, {usuarioEvaluado: req.body.usuarioEvaluado}] }
		//where: { usuarioCedula: req.params.idu }
	}).then(evaluacionUsuario => {
		console.log(isNumber);
		console.log(tipo);
		
		console.log(acomulador);
		console.log(calificacion);

		console.log(evaluacionUsuario);

		res.redirect('/dashboard');
	});

	
	

	//res.send(isNumber);
	//res.render('empleado/evaluacion/finalizado', { isNumber })
}