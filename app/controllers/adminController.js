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
					res.render('admin/index', {
						Presidente, 
						coordPlani, 
						coordEval, 
						Admin,
						message: req.flash('info')
					});	
				});
			});
		});
	});
	//FIN BUSQUEDA DEL PERSONAL DE CREDIUDO  
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
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('admin/asignar/coord_plani', { Usuario });
	})
}

exports.asignarCoordE = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('admin/asignar/coord_eval', { Usuario });
		//res.send('Asignar');  
	})
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
		console.log('=======' + req.body.cedula + '===========')
		req.flash('info', 'Presidente Asignado Exitosamente!');
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
		console.log('=======' + req.body.cedula + '===========')
		req.flash('info', 'Coord. Planificación Asignado Exitosamente!');
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
		console.log('=======' + req.body.cedula + '===========')
		req.flash('info', 'Coord. Evaluación Asignado Exitosamente!');
		res.redirect('/admin');
		//res.send(Usuario);
	});
}

exports.buscarUsuario = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.params.id }
	}).then(User => {
		if(User) {
			res.json(User)	
		} else {
			res.json(false)
		}
	}).catch(err => {
		console.log(err)
	})
}

exports.getAdmin = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 1 }
	}).then(Admin => {
		res.json(Admin)
	}).catch(err => {
		console.log(err)
	})
}

exports.getPresidente = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 2 }
	}).then(Presidente => {
		res.json(Presidente)
	}).catch(err => {
		console.log(err)
	})
}

exports.getCoordPlani = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 3 }
	}).then(CoordPlani => {
		res.json(CoordPlani)
	}).catch(err => {
		console.log(err)
	})
}