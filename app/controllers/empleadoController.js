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

/*
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
				usuarioId: req.params.idue,
				evaluacionId: req.params.id
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
}
*/

exports.procesarEval = function(req, res) {
	console.log('=================Procesando Evaluacion===================');
	//numero de factores
	var numFactores = req.body.factores;
	//cambiando el numFactores a number
	var numberF = parseInt(numFactores);

	//numero de items
	var numItems = req.body.items;
	//cambiando el numItems a number
	var numberI = parseInt(numItems);

	console.log('Numero de factores: '+numberF);
	console.log('Numero de items: '+numberI);

	models.instrumentFactor.findAll({
		include: [models.factor],
		where: {
			instrumentId: req.body.instrumentId
		}
	}).then(Factores => {

		var cantidadItems = 0;
		var acomulado = [];
		var acomuladoGeneral = 0;
		var calificacionFinal;

		for(let j = 0; j < Factores.length; j ++) {
			acomulado[j] = 0;
			
			models.item.findAll({
				where: {
					[Op.and]: [
						{factorId: Factores[j].factorId}, 
						{instrumentId: req.body.instrumentId}
					]
				}
			}).then(Items => {
				//obteniendo la calificacion por cada factor
				console.log('======='+Factores[j].factor.nombre+'========');
				for(let k = 0; k < Items.length; k ++) {
					acomulado[j] = acomulado[j] + parseInt(req.body.item[k][j]);
					acomuladoGeneral = acomuladoGeneral + parseInt(req.body.item[k][j]);	
				}
				console.log('calificación: '+ acomulado[j] / Items.length);
				calificacionFinal = acomuladoGeneral / numberI;
				console.log('calificación General: '+calificacionFinal);

				models.evaluacionUsuario.update({
					calificacion: calificacionFinal,
					status: true
				}, {
					where: { 
						[Op.and]: [
							{usuarioCedula: req.params.idu}, 
							{evaluacionId:req.params.id}, 
							{usuarioEvaluado: req.params.idue}
						] 
					}
				}).then(evaluacionUsuario => {
					models.factorUsuario.create({
						calificacion: acomulado[j] / Items.length,
						evaluacionId: req.params.id,
						usuarioEvaluador: req.params.idu,
						usuarioEvaluado: req.params.idue,
						factorId: Factores[j].factorId
					}).then(factorUsuario => {
						console.log('factorUsuario creado');
					})
				})
			});
		}

		//obteniendo en la calificacion general
		/*for(let i = 0; i < numberI; i ++) {
			//acomulado[j] = acomulado[j] + parseInt(req.body.item[i]);
			acomuladoGeneral = acomuladoGeneral + parseInt(req.body.item[i]);
			calificacionFinal = acomuladoGeneral / numberI;
					 
			//console.log('Valor del Item['+i+']: '+req.body.item[i]);
		}*/
		
		//calificacionFinal = acomuladoGeneral / cantidadItems;

		res.redirect('/dashboard');
	});

	
}