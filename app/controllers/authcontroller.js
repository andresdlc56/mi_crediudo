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

exports.signinCrediudo = function(req, res) {
    res.render('index/loginCrediudo', {
    	error: req.flash('error') 
    });
}

//------Controlador para Usuarios UDO-------
exports.dashboard = function(req, res) {
	var usuario = req.user;
	var fecha_actual = new Date();

	//primero verificamos que el nucleo y la unidad sean una unidad administrativa
	models.nucleo.findOne({
		where:{ codigo: req.user.nucleoCodigo }
	}).then(Nucleo => {
		//Si el Nucleo es administrativo
		if(Nucleo.categoriumId == 1) {
			/*
				Buscar las Evaluaciones donde nucleo y unidad sea igual 
				al nucleo y unidad del usuario que inicio sesion, su
				instrumentId sea igual a 4 y su fecha de inicio y final 
				esten en el rango apropiado
			*/
			models.evaluacion.findAll({
				where: { 
					[Op.and]: [
						{nucleoCodigo:usuario.nucleoCodigo}, 
						{unidadCodigo:usuario.unidadCodigo},
						{instrumentId: 4},
						{
							fecha_f: {
								[Op.gte]: fecha_actual
							}
						}
					] 
				}
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
							models.observacion.findAll({
								where: {
									usuarioCedula: req.user.cedula,
									status: false
								},
								include: [ models.evaluacion ]
							}).then(Observacion => {
								models.evaluacion.findAll({
									limit: 3,
									where: { 
										[Op.and]: [
											{nucleoCodigo:usuario.nucleoCodigo}, 
											{unidadCodigo:usuario.unidadCodigo},
											{instrumentId: 4},
											{
												fecha_i: {
													[Op.gte]: fecha_actual
												}
											},
											{
												fecha_f: {
													[Op.lte]: fecha_actual
												}
											}
										] 
									},
									order: [
										['id', 'DESC']
									]
								}).then(evalCulminada => {
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
												Observacion,
												evalCulminada,
												message: req.flash('info')
											});
											//res.send(evaluacionUsuario);	
										});	
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
												Observacion,
												evalCulminada,
												message: req.flash('info')
											});
										});
									}		
								});	
							});
						});		
					});
				});	
			});
		} else {
			//Evaluamos que el Usuario sea jefeSubordinado
			if(req.user.cargoId == 2) {
				/*
					Buscar las Evaluaciones donde nucleo y unidad sea igual 
					al nucleo y unidad del usuario que inicio sesion, su
					instrumentId sea igual a 6 y su fecha de inicio y final 
					esten en el rango apropiado
				*/
				models.evaluacion.findAll({
					where: { 
						[Op.and]: [
							{nucleoCodigo:usuario.nucleoCodigo}, 
							{unidadCodigo:usuario.unidadCodigo},
							{instrumentId: 6},
							{
								fecha_f: {
									[Op.gte]: fecha_actual
								}
							}
						] 
					}
				}).then(Evaluacion => {
					//buscamos los datos del Usuario logueado
					models.usuario.findOne({
						include: [ models.nucleo, models.unidad ],
						where: { cedula: req.user.cedula }
					}).then(Usuario => {
						models.observacion.findAll({
							where: {
								usuarioCedula: req.user.cedula,
								status: false
							},
							include: [ models.evaluacion ]
						}).then(Observacion => {
							models.evaluacion.findAll({
								limit: 3,
								where: { 
									[Op.and]: [
										{nucleoCodigo:usuario.nucleoCodigo}, 
										{unidadCodigo:usuario.unidadCodigo},
										{instrumentId: 6},
										{
											fecha_i: {
												[Op.gte]: fecha_actual
											}
										},
										{
											fecha_f: {
												[Op.lte]: fecha_actual
											}
										}
									] 
								},
								order: [
									['id', 'DESC']
								]
							}).then(evalCulminada => {
								res.render('empleado/index', {
									Evaluacion,
									Usuario,
									Observacion,
									evalCulminada,
									message: req.flash('info')
								})
							})
						})
					})
				})
			} else if(req.user.cargoId == 3) {
				res.send("Subordinado");
			}
		}
	})
	
}

//-----Controlador para Usuarios CREDIUDO----
exports.userCrediudo = function(req, res) {
	console.log('-------------Entro al controlador de userCrediudo----------');
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
	}	
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}