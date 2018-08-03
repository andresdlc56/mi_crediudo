var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.evaluacion = function(req, res) {
	//busca un usuario que tenga como cedula el id que viene por parametro
	models.usuario.findById(req.params.idu).then(Usuario => {
		//busca una evaluacion que tenga como id el id que viene por parametro 
		models.evaluacion.findOne({
			include: [models.instrument, models.nucleo, models.unidad],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			/*
				busca todos los factores que estan relacionados con el instrumento que esta relacionado 
				a la evaluacion encontrada anteriormente
			*/
			models.instrumentFactor.findAll({
				include: [models.factor],
				where: { instrumentId: Evaluacion.instrumentId }
			}).then(instrumentFactor => {
				/*
					busca todos los items que estan relacionados con el instrumento que esta relacionado
					con esta evaluacion
				*/
				models.item.findAll({
					where: { instrumentId: Evaluacion.instrumentId }
				}).then(Items => {
					
					models.evaluacionUsuario.findOne({
						where: { 
								[Op.and]: [
									{usuarioCedula: req.params.idu}, 
									{evaluacionId:req.params.id},
									{usuarioEvaluado:req.params.idue}
								] 
							}
					}).then(evaluacionUsuario => {
						models.usuario.findAll({

						}).then(usuariosTodos => {
							if (Usuario.nucleoCodigo == Evaluacion.nucleoCodigo && Usuario.unidadCodigo == Evaluacion.unidadCodigo) {
								//res.send(evaluacionUsuario);
								res.render('empleado/evaluacion/index', { 
									Usuario, 
									Evaluacion, 
									instrumentFactor, 
									Items,
									evaluacionUsuario,
									usuariosTodos 
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

	models.item.findAll({
		where: { instrumentId: req.body.instrumentId }
	}).then(Item => {
		var numItems = Item.length;
		
		for(let i = 0; i < numItems; i ++) {
			arreglo[i] = parseInt(req.body.item[i]);
			acomulador = acomulador + arreglo[i];

			models.itemUsuario.create({
				calificacion: arreglo[i], 
				itemId: Item[i].id,
				usuarioId: req.params.idue
			}).then(itemUsuario => {
				console.log('itemUsuario Creado');
			});
		}

		var calificacion = acomulador/isNumber;

		models.evaluacionUsuario.update({
			calificacion: calificacion,
			status: true
		}, {
			where: { 
				[Op.and]: [
					{usuarioCedula: req.params.idu}, 
					{evaluacionId:req.params.id}, 
					{usuarioEvaluado: req.params.idue}
				] 
			}
			//where: { usuarioCedula: req.params.idu }
		}).then(evaluacionUsuario => {
			res.redirect('/dashboard');
		});
	});


	/*
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
		where: { 
			[Op.and]: [{usuarioCedula: req.params.idu}, 
						{evaluacionId:req.params.id}, 
						{usuarioEvaluado: req.params.idue}] 
		}
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
	*/
}