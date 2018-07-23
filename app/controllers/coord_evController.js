var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
	res.render('coord_ev/index');
}

exports.factor = function(req, res) {
	res.render('coord_ev/factor/index');
	//res.send('Factor');
}

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

exports.instrument = function(req, res) {
	
	models.instrument.findAll({
		include: [models.categoria, models.tipoEval],
	}).then(Instruments => {
		//res.send(Instruments);
		res.render('coord_ev/instrumento/index', { Instruments });
	})
}

exports.addInstrument = function(req, res) {

	models.categoria.findAll({

	}).then(Categorias => {
		models.tipoEval.findAll({

		}).then(tipoEval => {
			res.render('coord_ev/instrumento/add', { Categorias, tipoEval });
		})
	})
}

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

	models.instrument.findById(req.params.id).then(Instruments => {
		models.factor.findAll({

		}).then(Factores => {
			models.item.findAll({
				include: [models.factor],
				where: { instrumentId: req.params.id }
			}).then(Items => {
				//res.send(Items);
				res.render('coord_ev/instrumento/ver', { Instruments, Factores, Items });	
			})
		});
	});
}
/*
exports.addItem = function(req, res) {

	models.item.create({
		nombre: req.body.nombre,
		valor: 0,
		factorId: req.body.factor,
		instrumentId: req.params.id
	}).then(Item => {
		res.redirect('/coord_ev/instrument/'+req.params.id);
	});
}
*/

exports.addItem = function(req, res) {
	var Factor = req.body.factor;

	models.instrumentFactor.findAll({
		where: { factorId: Factor }
	}).then(instrumentFactor => {
		if (instrumentFactor.length > 0) {
			//res.send(instrumentFactor);
			for(var i = 0; i < instrumentFactor.length; i ++){
				if (instrumentFactor[i].factorId == Factor) {
					if (instrumentFactor[i].instrumentId != req.params.id) {
						//res.send('excelente');
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
						break;
					} else {
						//res.send('no procede');
						models.item.create({
							nombre: req.body.nombre,
							valor: 0,
							factorId: req.body.factor,
							instrumentId: req.params.id
						}).then(Item => {
							res.redirect('/coord_ev/instrument/'+req.params.id);
						})
						break;	
					}
				}
			}
		} 
	})
}