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
		//res.send('Ver Instrumento');
		res.render('coord_ev/instrumento/ver', { Instruments });
	})
}