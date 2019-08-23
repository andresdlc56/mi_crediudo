var exports = module.exports = {}

var models = require('../models');
var multer = require('multer'); //para el manejo de multipart/form usado para cargar archivos
const path = require('path');
var fs = require('fs');

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
		unidadCodigo: 12,
		cediudo: true
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

/*================Controladores para Cambiar Cargos========================*/
exports.cambiarPresi = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('admin/cambiar/presidente', { Usuario })
	})
}

exports.cambiarCoordPlani = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('admin/cambiar/coordPlani', { Usuario })
	})
}

exports.cambiarCoordEval = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		res.render('admin/cambiar/coordEval', { Usuario })
	})
}

/*================================Controladores para Axios============================*/
exports.buscarUsuario = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad, models.rol ],
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

exports.getCoordEval = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 4 }
	}).then(CoordEval => {
		res.json(CoordEval)
	}).catch(err => {
		console.log(err)
	})
}

/*===============================Reemplazar================================*/
exports.reemplazar = function(req, res) {
	models.usuario.update({
		nucleoCodigo: req.body.nucleoCandidato,
		unidadCodigo: req.body.unidadCandidato,
		cargoId: req.body.cargoCandidato,
		rolId: req.body.rolCandidato
	},{
		where: {
			cedula: req.body.cedulaReemplazado
		}
	}).then(exEncargado => {
		models.usuario.update({
			nucleoCodigo: req.body.nucleoReemplazado,
			unidadCodigo: req.body.unidadReemplazado,
			cargoId: req.body.cargoReemplazado,
			rolId: req.body.rolReemplazado	
		}, {
			where: {
				cedula: req.body.cedulaCandidato
			}
		}).then(newEncargado => {
			console.log('=====================Usuarios Actualizados Exitosamente========================');
			req.flash('info', 'Actualización Exitosa!');
			res.redirect('/admin');
		})
	})
}

exports.creacionMision = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 1 }
	}).then(Admin => {
		res.render('admin/conocenos/creacion&mision/index', {
			Admin,
			message: req.flash('info')
		});
	})
}

/*-------Solicitar info de la seccion "Creacion"-------*/
exports.getCreacion = function(req, res) {
	models.modulo.findOne({
		where: { id: 1 }
	}).then(Creacion => {
		res.json(Creacion);
	}).catch(err => {
		res.json(err);
	});
}

/*-----------Actualizar zona de "Creacion"---------*/
exports.updateCreacion = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/index/conocenos/creacion&mision',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('urlImg');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /jpeg|jpg|png|gif/;

		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			console.log('error');
			res.send('algun error')
		} else{
			if(req.file == undefined){
				models.modulo.update({
					descripcion: req.body.descripcion
				}, {
					where: {
						id: 1
					}
				}).then(Evento => {
					console.log('=========Seccion de "Creacion" Actualizado Sin Img============');
					req.flash('info', 'Sección de Creación Actualizado Exitosamente');
					res.redirect('/admin/conocenos/creacion&mision');
				})
				console.log(req.file);
			} else{
				models.modulo.update({
					descripcion: req.body.descripcion,
					urlImg: req.file.filename
				}, {
					where: {
						id: 1
					}
				}).then(Evento => {
					console.log('============Sección de "Creacion" Actualizado Con Img==============');
					req.flash('info', 'Sección de Creación Actualizado Exitosamente');
					res.redirect('/admin/conocenos/creacion&mision');
				}).catch(err => {
					console.log(err)
				});
			}
		}
	})
}

/*-------Solicitar info de la seccion "Mision"-------*/
exports.getMision = function(req, res) {
	models.modulo.findOne({
		where: { id: 2 }
	}).then(Mision => {
		res.json(Mision);
	}).catch(err => {
		res.json(err);
	});
}

/*-----------Actualizar zona de "Creacion"---------*/
exports.updateMision = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/index/conocenos/creacion&mision',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('urlImg');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /jpeg|jpg|png|gif/;

		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			console.log('error');
			res.send('algun error')
		} else{
			if(req.file == undefined){
				models.modulo.update({
					descripcion: req.body.descripcion
				}, {
					where: {
						id: 2
					}
				}).then(Evento => {
					console.log('=========Seccion de "Mision" Actualizado Sin Img============');
					req.flash('info', 'Sección de Misión Actualizado Exitosamente');
					res.redirect('/admin/conocenos/creacion&mision');
				})
				console.log(req.file);
			} else{
				models.modulo.update({
					descripcion: req.body.descripcion,
					urlImg: req.file.filename
				}, {
					where: {
						id: 2
					}
				}).then(Evento => {
					console.log('============Sección de "Mision" Actualizado Con Img==============');
					req.flash('info', 'Sección de Misión Actualizado Exitosamente');
					res.redirect('/admin/conocenos/creacion&mision');
				}).catch(err => {
					console.log(err)
				});
			}
		}
	})
}

/*-------Solicitar info de la seccion "Vision"-------*/
exports.getVision = function(req, res) {
	models.modulo.findOne({
		where: { id: 3 }
	}).then(Vision => {
		res.json(Vision);
	}).catch(err => {
		res.json(err);
	});
}

/*-----------Actualizar zona de "Vision"---------*/
exports.updateVision = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/index/conocenos/creacion&mision',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('urlImg');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /jpeg|jpg|png|gif/;

		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			console.log(err);
			req.flash('info', 'Disculpe parece que a sucedido un Error');
			res.redirect('/admin/conocenos/creacion&mision');
		} else{
			if(req.file == undefined){
				models.modulo.update({
					descripcion: req.body.descripcion
				}, {
					where: {
						id: 3
					}
				}).then(Evento => {
					console.log('=========Seccion de "Vision" Actualizado Sin Img============');
					req.flash('info', 'Sección de Visión Actualizado Exitosamente');
					res.redirect('/admin/conocenos/creacion&mision');
				})
				console.log(req.file);
			} else{
				models.modulo.update({
					descripcion: req.body.descripcion,
					urlImg: req.file.filename
				}, {
					where: {
						id: 3
					}
				}).then(Evento => {
					console.log('============Sección de "Vision" Actualizado Con Img==============');
					req.flash('info', 'Sección de Visión Actualizado Exitosamente');
					res.redirect('/admin/conocenos/creacion&mision');
				}).catch(err => {
					console.log(err)
				});
			}
		}
	})
}

exports.objetivos = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 1 }
	}).then(Admin => {
		res.render('admin/conocenos/objetivos/index', {
			Admin,
			message: req.flash('info')
		});
	});
}

exports.getObjetivos = function(req, res) {
	models.modulo.findOne({
		where: { id: 4 }
	}).then(Objetivos => {
		res.json(Objetivos);
	}).catch(err => {
		res.json(err);
	});
}

exports.updateObjetivos = function(req, res) {
	models.modulo.update({
		descripcion: req.body.descripcion
	}, {
		where: { id: 4 }
	}).then(Objetivo => {
		console.log('============Sección de "Objetivos" Actualizado Exitosamente==============');
		req.flash('info', 'Sección de Objetivos Actualizada Exitosamente');
		res.redirect('/admin/conocenos/objetivos');
	}).catch(err => {
		console.log('============ha Ocurrido un Error==============');
		req.flash('info', 'ha Ocurrido un Error');
		res.redirect('/admin/conocenos/objetivos');
	})
}

exports.funciones = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 1 }
	}).then(Admin => {
		res.render('admin/conocenos/funciones/index', {
			Admin,
			message: req.flash('info')
		});
	});
}

exports.getFunciones = function(req, res) {
	models.modulo.findOne({
		where: { id: 5 }
	}).then(Objetivos => {
		res.json(Objetivos);
	}).catch(err => {
		res.json(err);
	});
}

exports.updateFunciones = function(req, res) {
	models.modulo.update({
		descripcion: req.body.descripcion
	}, {
		where: { id: 5 }
	}).then(Objetivo => {
		console.log('============Sección de "Funciones" Actualizado Exitosamente==============');
		req.flash('info', 'Sección de Funciones Actualizada Exitosamente');
		res.redirect('/admin/conocenos/funciones');
	}).catch(err => {
		console.log('============ha Ocurrido un Error==============');
		req.flash('info', 'ha Ocurrido un Error');
		res.redirect('/admin/conocenos/funciones');
	})
}

exports.subComisiones = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 1 }
	}).then(Admin => {
		res.render('admin/conocenos/subComisiones/index', {
			Admin,
			message: req.flash('info')
		});
	});
}

exports.etapas = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { rolId: 1 }
	}).then(Admin => {
		res.render('admin/conocenos/etapas/index', {
			Admin,
			message: req.flash('info')
		});
	});
}

exports.getEtapas = function(req, res) {
	models.modulo.findOne({
		where: { id: 6 }
	}).then(Etapas => {
		res.json(Etapas);
	}).catch(err => {
		res.json(err);
	});
}

exports.updateEtapas = function(req, res) {
	models.modulo.update({
		descripcion: req.body.descripcion
	}, {
		where: { id: 6 }
	}).then(Etapas => {
		console.log('============Sección de "Etapas" Actualizado Exitosamente==============');
		req.flash('info', 'Sección de Etapas Actualizada Exitosamente');
		res.redirect('/admin/conocenos/etapas');
	}).catch(err => {
		console.log('============ha Ocurrido un Error==============');
		req.flash('info', 'ha Ocurrido un Error');
		res.redirect('/admin/conocenos/etapas');
	})
}

exports.reglamentos = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Admin => {
		models.regla.findAll({
			order: [[ 'id', 'DESC' ]]
		}).then(Reglas => {
			res.render('admin/conocenos/reglamentos/index', { Admin, Reglas });	
		})
	});
}

exports.subirReglamento = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/index/conocenos/reglamentos',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('pdf');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /pdf/;

		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			console.log(err);
			req.flash('info', 'Disculpe parece que a sucedido un Error');
			res.redirect('/admin/conocenos/reglamentos');
		} else{
			models.regla.create({
				titulo: req.body.titulo,
				descripcion: req.body.descripcion,
				pdf: req.file.filename
			}).then(Evento => {
				console.log('============Sección de "Vision" Actualizado Con Img==============');
				req.flash('info', 'Sección de Visión Actualizado Exitosamente');
				res.redirect('/admin/conocenos/reglamentos');
			}).catch(err => {
				console.log(err)
			});
		}
	})
}

exports.verReglamento = function(req, res) {
	models.regla.findOne({
		where: { id: req.params.id }
	}).then(Reglamento => {
	 	//var filePath = "../../uploads/index/conocenos/reglamentos/constancia.pdf";
	 	//console.log(path.join(__dirname , '../../public/uploads/index/conocenos/reglamentos/constancia.pdf'));
	 	var ruta = path.join(__dirname , '../../public/uploads/index/conocenos/reglamentos/');

	    res.sendFile(ruta+Reglamento.pdf);
	}).catch(err => {
		res.json(err);
	})
}

exports.getReglamento = function(req, res) {
	models.regla.findOne({
		where: { id: req.params.id }
	}).then(Regla => {
		res.json(Regla);
	}).catch(err => {
		res.json(err);
	});
}