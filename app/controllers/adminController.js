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
				//res.send(Presidente);
				res.render('admin/index', {Presidente, coordPlani, coordEval});	
			})
		})
	});
	//FIN BUSQUEDA DEL PERSONAL DE CREDIUDO  
}

exports.probando = function(req, res) {
	//return ['Andres', 'Paola', 'Carla'];
	res.send('Probando');  
}

exports.asignarCoordP = function(req, res) {
	res.render('admin/asignar/coord_plani');
	//res.send('Asignar');  
}

exports.asignarCoordE = function(req, res) {
	res.render('admin/asignar/coord_eval');
	//res.send('Asignar');  
}

exports.buscar_cp = function(req, res) {

	models.usuario.findOne({
		where:{cedula: req.body.cedula}
	}).then(Usuario => {
		if (Usuario.rolId == 5) {
			//res.send(Usuario);
			res.render('admin/asignar/busqueda-cp', {Usuario});	
		} else if(Usuario.rolId == 1){
			res.send('Este Usuario ya esta asignado para el cargo de admin');
		} else if(Usuario.rolId == 2) {
			res.send('Este Usuario ya esta asignado para el cargo de presidente');
		} else if(Usuario.rolId == 3) {
			res.send('Este Usuario ya esta asignado para el cargo de Coord. Planificación');
		} else if(Usuario.rolId == 4) {
			res.send('Este Usuario ya esta asignado para el cargo de Coord. Evaluación');
		}
	});  
}

exports.buscar_ce = function(req, res) {

	models.usuario.findOne({
		where:{cedula: req.body.cedula}
	}).then(Usuario => {
		if (Usuario.rolId == 5) {
			//res.send(Usuario);
			res.render('admin/asignar/busqueda-ce', {Usuario});	
		} else if(Usuario.rolId == 1){
			res.send('Este Usuario ya esta asignado para el cargo de admin');
		} else if(Usuario.rolId == 2) {
			res.send('Este Usuario ya esta asignado para el cargo de presidente');
		} else if(Usuario.rolId == 3) {
			res.send('Este Usuario ya esta asignado para el cargo de Coord. Planificación');
		} else if(Usuario.rolId == 4) {
			res.send('Este Usuario ya esta asignado para el cargo de Coord. Evaluación');
		}
	});  
}

exports.asignaCoordP = function(req, res) {
	
	models.usuario.update({
		rolId: 3
	},{
		where: {
			cedula: req.body.cedula
		}
	}).then(Usuario => {
		res.redirect('/admin');
		//res.send(Usuario);
	});
}

exports.asignaCoordE = function(req, res) {
	
	models.usuario.update({
		rolId: 4
	},{
		where: {
			cedula: req.body.cedula
		}
	}).then(Usuario => {
		res.redirect('/admin');
		//res.send(Usuario);
	});
}