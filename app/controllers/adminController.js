var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {

	//BUSQUEDA DEL PERSONAL DE CREDIUDO
	models.usuario.findOne({
		where:{rolId: 2} 
	}).then(Presidente => {
		models.usuario.findOne({
			where:{rolId: 3}
		}).then(coordPlani => {
			models.usuario.findOne({
				where:{rolId: 4}
			}).then(coordEval => {
				//res.send(coordPlani);
				res.render('admin/index', {Presidente, coordPlani, coordEval});	
			})
		})
	});
	//FIN BUSQUEDA DEL PERSONAL DE CREDIUDO  
}

exports.asignarCoordP = function(req, res) {
	res.render('admin/asignar/coord_plani');
	//res.send('Asignar');  
}

exports.asignarCoordE = function(req, res) {
	res.render('admin/asignar/coord_eval');
	//res.send('Asignar');  
}

exports.buscar = function(req, res) {
	res.send('Buscando');  
}