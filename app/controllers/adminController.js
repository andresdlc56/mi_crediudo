var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {

	//BUSQUEDA DEL PERSONAL DE CREDIUDO
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where:{rolId: 2} 
	}).then(Presidente => {
		models.usuario.findOne({
			include: [ models.nucleo, models.unidad ],
			where:{rolId: 3}
		}).then(coordPlani => {
			models.usuario.findOne({
				include: [ models.nucleo, models.unidad ],
				where:{rolId: 4}
			}).then(coordEval => {
				models.usuario.findOne({
					include: [ models.nucleo, models.unidad ],
					where: { rolId: 1 }
				}).then(Admin => {
					//res.send(Presidente);
					res.render('admin/index', {Presidente, coordPlani, coordEval, Admin});	
				});
			});
		});
	});
	//FIN BUSQUEDA DEL PERSONAL DE CREDIUDO  
}

exports.probando = function(req, res) {
	//return ['Andres', 'Paola', 'Carla'];
	res.send('Probando');  
}

exports.asignarPresi = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('admin/asignar/presi', { Usuario });	
	})
}

exports.asignarCoordP = function(req, res) {
	res.render('admin/asignar/coord_plani');
	//res.send('Asignar');  
}

exports.asignarCoordE = function(req, res) {
	res.render('admin/asignar/coord_eval');
	//res.send('Asignar');  
}

exports.buscar_presi = function(req, res) {

	models.usuario.findOne({
		where:{cedula: req.body.cedula}
	}).then(Usuario => {
		if(Usuario == undefined) {
			res.send("El Usuario no Existe");
		} else {
			if (Usuario.rolId == 5) {
				//res.send(Usuario);
				res.render('admin/asignar/busqueda-presi', {Usuario});	
			} else if(Usuario.rolId == 1){
				res.send('Este Usuario ya esta asignado para el cargo de admin');
			} else if(Usuario.rolId == 2) {
				res.send('Este Usuario ya esta asignado para el cargo de presidente');
			} else if(Usuario.rolId == 3) {
				res.send('Este Usuario ya esta asignado para el cargo de Coord. Planificación');
			} else if(Usuario.rolId == 4) {
				res.send('Este Usuario ya esta asignado para el cargo de Coord. Evaluación');
			}	
		}
	});  
}

exports.buscar_cp = function(req, res) {

	models.usuario.findOne({
		where:{cedula: req.body.cedula}
	}).then(Usuario => {
		if(Usuario == undefined) {
			res.send("El Usuario no Existe");
		} else {
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
		}
		
	});  
}

exports.buscar_ce = function(req, res) {

	models.usuario.findOne({
		where:{cedula: req.body.cedula}
	}).then(Usuario => {
		if(Usuario == undefined) {
			res.send("El Usuario no Existe");
		} else {
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
		}	
	}).catch(function(e) {
  		console.log(e); // "oh, no!"
	});  
}

exports.asignaPresi = function(req, res) {
	
	models.usuario.update({
		nucleoCodigo: 1,
		rolId: 2,
		unidadCodigo: 12
	},{
		where: {
			cedula: req.body.cedula
		}
	}).then(Usuario => {
		res.redirect('/admin');
		//res.send(Usuario);
	});
}

exports.asignaCoordP = function(req, res) {
	
	models.usuario.update({
		nucleoCodigo: 1,
		rolId: 3,
		unidadCodigo: 12
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
		nucleoCodigo: 1,
		rolId: 4,
		unidadCodigo: 12
	},{
		where: {
			cedula: req.body.cedula
		}
	}).then(Usuario => {
		res.redirect('/admin');
		//res.send(Usuario);
	});
}

exports.buscarUsuario = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.params.id }
	}).then(User => {
		res.json(User)
	}).catch(err => {
		console.log(err)
	})
}