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
	})


	
}