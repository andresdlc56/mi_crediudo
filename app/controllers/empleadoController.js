var exports = module.exports = {}

var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.evaluacion = function(req, res) {
	var user = req.user;
	//busca un usuario que tenga como cedula el id que viene por parametro
	models.usuario.findById(req.params.idu).then(Usuario => {
		//busca una evaluacion que tenga como id el id que viene por parametro 
		models.evaluacion.findOne({
			include: [models.instrument, models.nucleo, models.unidad],
			where: { id: req.params.id }
		}).then(Evaluacion => {
			/*
				busca todos los factores que estan relacionados con el instrumento que a su ves esta relacionado 
				a la evaluacion encontrada anteriormente
			*/
			models.instrumentFactor.findAll({
				include: [models.factor],
				where: { instrumentId: Evaluacion.instrumentId }
			}).then(instrumentFactor => {
				/*
					busca todos los items que estan relacionados con el instrumento que a su ves esta relacionado
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
									usuariosTodos,
									user
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
	console.log('=================Procesando Evaluacion===================');
	var item = [];
	var acomulado = 0;
	var calificacionFinal = 0;
	console.log('========Buscando Items==========');
	models.item.findAll({
		where: { instrumentId: req.body.instrumentId }
	}).then(Items => {
		for(let i = 0; i < Items.length; i ++) {
			item[i] = parseInt(req.body.item[i]); 
			acomulado = acomulado + item[i];
			console.log(Items[i].nombre+': '+item[i]);

			models.itemUsuario.create({
				calificacion: item[i],
				evaluacionId: req.params.id,
				itemId: Items[i].id,
				evaluado: req.params.idue,
				evaluador: req.params.idu
			}).then(itemUsuario => {
				console.log('====Respuesta Almacenada=====');
			})
		}

		calificacionFinal = acomulado / Items.length;
		console.log('Calificacion Final: '+calificacionFinal);

		models.evaluacionUsuario.update({
			calificacion: calificacionFinal,
			status: true
		}, {
			where: {
				usuarioEvaluado: req.params.idue,
				evaluacionId: req.params.id,
				usuarioCedula: req.params.idu
			}
		}).then(evaluacionUsuario => {
			console.log('Calificacion final Almacenada Exitosamente');
		});
		req.flash('info', 'Gracias por su tiempo, Sus respuestas se han enviado Exitosamente!');
		res.redirect('/dashboard');
	});
}

exports.observaciones = function(req, res) {
	var user = req.user;

	models.observacion.findOne({
		where: {
			[Op.and]: [
				{id: req.params.id}, 
				{usuarioCedula: req.user.cedula},
			] 
		},
		include: [ models.evaluacion ]
	}).then(Observacion => {
		models.evaluacionUsuario.findOne({
			where: {
				[Op.and]: [
					{evaluacionId: Observacion.evaluacion.id}, 
					{usuarioEvaluado: req.user.cedula},
				]  
			},
			include: [ models.evaluacion ]
		}).then(evalUser => {
			models.itemUsuario.findAll({
				include: [ models.item ],
				where: {
					[Op.and]: [
						{evaluacionId: Observacion.evaluacion.id}, 
						{evaluado: req.user.cedula}
					]
				}
			}).then(itemUsuario => {
				models.instrumentFactor.findAll({
					where: { instrumentId: Observacion.evaluacion.instrumentId },
					include: [ models.factor ]
				}).then(Factores => {
					var acomulador = [];
					var calificacionFactor = [];

					for(let i = 0; i < Factores.length; i ++) {
						acomulador[i] = 0;
							
						var n = 0;
						console.log('================Nombre Factor: '+Factores[i].factor.nombre+'====================');
						for(let j = 0; j < itemUsuario.length; j ++) {
								
							if(itemUsuario[j].item.factorId == Factores[i].factorId) {
								n = n + 1;
								//console.log(Item[j].item.nombre);
								acomulador[i] = acomulador[i] + itemUsuario[j].calificacion;
								console.log('Acomulador'+[i]+': '+acomulador[i]);
							}
								
							calificacionFactor[i] = acomulador[i]/n;
						}
						console.log('calificacion factor '+Factores[i].factor.nombre+': '+calificacionFactor[i]);
						console.log('nro. de preguntas: '+n);
					}

					models.usuario.findOne({
						where: {
							[Op.and]: [
								{unidadCodigo: 12}, 
								{rolId: 2},
								{nucleoCodigo: 1}
							]
						}
					}).then(Presidente => {
						//res.send(Factores);
						res.render('empleado/observacion/index', { 
							Observacion,
							evalUser,
							Factores,
							calificacionFactor,
							user,
							Presidente
						});
					})
				})
			})
		})
	})
}