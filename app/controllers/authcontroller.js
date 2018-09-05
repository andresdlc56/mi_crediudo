var exports = module.exports = {}

var models = require('../models'); 
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.signup = function(req, res) {
    res.render('signup');
}

exports.signin = function(req, res) {
    res.render('index/login', {
    	error: req.flash('error') 
    });
}

exports.dashboard = function(req, res) {
	var usuario = req.user;
	var fecha_actual = new Date();

	//si el rol del usuario es 1 (admin)
	if (usuario.rolId == 1) {
		res.redirect('/admin');
		//res.render('dashboard', { usuario });	
	} else if(usuario.rolId == 2) {
		res.redirect('/president');
		//res.status(201).send('Bienvenido Presidente');
	} else if(usuario.rolId == 3) {
		res.redirect('/coord_plani');
		//res.status(201).send('Bienvenido Coord Planificación');
	} else if(usuario.rolId == 4) {
		res.redirect('/coord_ev');
		//res.status(201).send('Bienvenido Coord Evaluación');
	} else if(usuario.rolId == 5) {
		models.evaluacion.findAll({
			where: { [Op.and]: [{nucleoCodigo:usuario.nucleoCodigo}, {unidadCodigo:usuario.unidadCodigo}] }
		}).then(Evaluacion => {
			models.evaluacionUsuario.findAll({
				include: [models.evaluacion],
				where: { [Op.and]: [{usuarioCedula: usuario.cedula}, {status:false}] }
				//where: { usuarioCedula: usuario.cedula }
			}).then(evaluacionUsuario => {
				models.usuario.findOne({
					include: [models.nucleo, models.unidad],
					where: { cedula: usuario.cedula }
				}).then(Usuario => {
					models.usuario.findAll({
						where: { 
							[Op.and]: [ 
								{nucleoCodigo: Usuario.nucleoCodigo}, 
								{unidadCodigo: Usuario.unidadCodigo}, 
							] 
						}
					}).then(Empleado => {
						if(Usuario.cargoId == 3) {
							var subordinados = false;
							models.usuario.findOne({
								include: [models.nucleo, models.unidad],
								where: { 
									[Op.and]: [{cargoId: 2}, 
									{nucleoCodigo: Usuario.nucleoCodigo}, 
									{unidadCodigo: Usuario.unidadCodigo}, 
									{rolId: Usuario.rolId}] 
								}
							}).then(jefeSubordinado => {
								console.log(Usuario.cargoId);
								res.render('empleado/index', { 
									Evaluacion, Usuario, 
									evaluacionUsuario, 
									jefeSubordinado, 
									subordinados,
									fecha_actual,
									Empleado,
									message: req.flash('info')
								});
								//res.send(jefeSubordinado);	
							})	
						} 

						if(Usuario.cargoId == 2) {
							var jefeSubordinado = false;

							models.usuario.findAll({
								include: [models.nucleo, models.unidad],
								where: { 
									[Op.and]: [{cargoId: 3}, 
									{nucleoCodigo: Usuario.nucleoCodigo}, 
									{unidadCodigo: Usuario.unidadCodigo}, 
									{rolId: Usuario.rolId}] 
								}
							}).then(subordinados => {
								//res.send(subordinados);
								console.log(fecha_actual);
								res.render('empleado/index', { 
									Evaluacion, 
									Usuario, 
									Empleado,
									evaluacionUsuario, 
									jefeSubordinado, 
									subordinados,
									fecha_actual,
									message: req.flash('info')
								});
							})
						}
					})		
				})
					
			});	
		});

		
		//res.redirect('/empleado');
		//res.status(201).send('Bienvenido Coord Evaluación');
	}
	//res.send('home | admin');
	
	//res.status(201).send(req.user);
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}