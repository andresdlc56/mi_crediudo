var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		res.render('coord_ev/index', { Usuario });
	})
}

exports.factor = function(req, res) {
	res.render('coord_ev/factor/index');
}

//agregando un nuevo factor
exports.addFactor = function(req, res) {
	models.factor.findOne({
		where: { nombre: req.body.nombre }
	}).then(Factor => {
		if(Factor == undefined){
			models.factor.create({
				nombre: req.body.nombre
			}).then(Factor => {
				res.redirect('/coord_ev/factor');
				//res.send('Factor');
			})
		} else{
			res.send('El factor existe');
		}
	});
}

//buscando todos los intrumentos
exports.instrument = function(req, res) {	
	models.instrument.findAll({
		include: [models.categoria, models.tipoEval],
	}).then(Instruments => {
		res.render('coord_ev/instrumento/index', { Instruments });
	})
}

exports.addInstrument = function(req, res) {
	//buscando todas las categorias
	models.categoria.findAll({

	}).then(Categorias => {
		//buscando todos los tipos de evaluación
		models.tipoEval.findAll({

		}).then(tipoEval => {
			res.render('coord_ev/instrumento/add', { Categorias, tipoEval });
		})
	})
}

//creando un nuevo instrumento de evaluacion
exports.createInstrument = function(req, res) {
	models.instrument.create({
		titulo: req.body.titulo,
		categoriumId: req.body.categoria,
		tipoEvalId: req.body.t_instrument
	}).then(Instrument => {
		res.redirect('/coord_ev/instrument');
		//res.send('Instrumento Creado Exitosamente');
	})
}

exports.verInstrument = function(req, res) {
	//buscando un instrumento en especifico
	models.instrument.findById(req.params.id).then(Instruments => {
		//buscando todos los factores
		models.factor.findAll({

		}).then(Factores => {
			//buscando todos los items que pertenecen al instrumento que inicialmente buscamos
			models.item.findAll({
				include: [models.factor],
				where: { instrumentId: req.params.id }
			}).then(Items => {
				res.render('coord_ev/instrumento/ver', { Instruments, Factores, Items });	
			})
		});
	});
}

//agregando Item
exports.addItem = function(req, res) {
	var Factor = req.body.factor;

	//buscando todos los Factores asociados asociados a instrumentos en la tabla instrumentFactor
	models.instrumentFactor.findAll({
		
	}).then(instrumentFactor => {
		if (instrumentFactor.length > 0) {
			//res.send(instrumentFactor);
			for(var i = 0; i < instrumentFactor.length; i ++){
				if (instrumentFactor[i].factorId == Factor && instrumentFactor[i].instrumentId == req.params.id) {
					//res.send('no procede');
						models.item.create({
							nombre: req.body.nombre,
							valor: 0,
							factorId: req.body.factor,
							instrumentId: req.params.id
						}).then(Item => {
							res.redirect('/coord_ev/instrument/'+req.params.id);
						})
				} else {
					//res.send('No Tiene conetenido');
					models.instrumentFactor.create({
						factorId: req.body.factor,
						instrumentId: req.params.id
					}).then(instrumentFactor => {
						models.item.create({
							nombre: req.body.nombre,
							valor: 0,
							factorId: req.body.factor,
							instrumentId: req.params.id
						}).then(Item => {
							res.redirect('/coord_ev/instrument/'+req.params.id);
						});
					});
				}
			}
		} else {
			//res.send('No Tiene conetenido');
			models.instrumentFactor.create({
				factorId: req.body.factor,
				instrumentId: req.params.id
			}).then(instrumentFactor => {
				models.item.create({
					nombre: req.body.nombre,
					valor: 0,
					factorId: req.body.factor,
					instrumentId: req.params.id
				}).then(Item => {
					res.redirect('/coord_ev/instrument/'+req.params.id);
				});
			});
		}
	})
}