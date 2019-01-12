var exports = module.exports = {}

var models = require('../models');
var multer = require('multer'); //para el manejo de multipart/form usado para cargar archivos
const path = require('path');

//==============Controlador Inicial============
exports.index = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		res.render('coord_ev/index', { Usuario });
	})
}

exports.factor = function(req, res) {
	res.render('coord_ev/factor/index');
}


//buscando todos los intrumentos
exports.instrument = function(req, res) {	
	models.instrument.findAll({
		include: [models.categoria, models.tipoEval],
	}).then(Instruments => {
		res.render('coord_ev/instrumento/index', { Instruments });
	})
}

exports.addInstrument = function(req, res) {
	//buscando todas las categorias
	models.categoria.findAll({

	}).then(Categorias => {
		//buscando todos los tipos de evaluación
		models.tipoEval.findAll({

		}).then(tipoEval => {
			res.render('coord_ev/instrumento/add', { Categorias, tipoEval });
		})
	})
}

//============Ver Datos de Un Instrumento en especifico(id)
exports.verInstrument = function(req, res) {
	//buscando un instrumento en especifico
	models.instrument.findById(req.params.id).then(Instruments => {
		//buscando todos los factores
		models.factor.findAll({

		}).then(Factores => {
			//buscando todos los items que pertenecen al instrumento que inicialmente buscamos
			models.item.findAll({
				include: [models.factor],
				where: { instrumentId: req.params.id }
			}).then(Items => {
				res.render('coord_ev/instrumento/ver', { Instruments, Factores, Items });	
			})
		});
	});
}

//agregando Item
exports.addItem = function(req, res) {
	var Factor = req.body.factor;

	//buscando todos los Factores asociados asociados a instrumentos en la tabla instrumentFactor
	models.instrumentFactor.findAll({
		
	}).then(instrumentFactor => {
		if (instrumentFactor.length > 0) {
			//res.send(instrumentFactor);
			for(var i = 0; i < instrumentFactor.length; i ++){
				if (instrumentFactor[i].factorId == Factor && instrumentFactor[i].instrumentId == req.params.id) {
					//res.send('no procede');
						models.item.create({
							nombre: req.body.nombre,
							valor: 0,
							factorId: req.body.factor,
							instrumentId: req.params.id
						}).then(Item => {
							res.redirect('/coord_ev/instrument/'+req.params.id);
						})
				} else {
					//res.send('No Tiene conetenido');
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
				}
			}
		} else {
			//res.send('No Tiene conetenido');
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
		}
	})
}

//Eventos
exports.getEventos = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		models.nucleo.findAll({

		}).then(Nucleos => {
			models.tipoEvento.findAll({
		
			}).then(tipoEvent => {

				res.render('coord_ev/eventos/index', { 
					Usuario, 
					Nucleos, 
					tipoEvent,
					message: req.flash('info') 
				});
			})
		})
	})
}

//traer todos los eventos
exports.eventTodos = function(req, res) {
	models.evento.findAll({

	}).then(Eventos => {
		res.json(Eventos)
	}).catch(err => {
		console.log(err)
	})
}

//enviarEvento
exports.enviarEvento = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/eventos',
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
				console.log(req.file);
				res.send('indefinido')
			} else{
				console.log(req.file.filename);
				models.evento.create({
					nombre: req.body.nombre,
					direccion: req.body.direccion,
					fecha: req.body.fecha,
					nucleoCodigo: req.body.nucleo,
					publico: req.body.publico,
					tipoEventoId: req.body.tipo,
					cupos: req.body.cupos,
					descripcion: req.body.descripcion,
					files: req.file.filename
				}).then(Evento => {
					req.flash('info', 'Evento: '+req.body.nombre+' Planificado Exitosamente');
					res.redirect('/coord_ev/eventos');
				}).catch(err => {
					console.log(err)
				});
			}
		}
	});
}

exports.verEventos = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: { cedula: req.user.cedula }
	}).then(Usuario => {
		models.evento.findAll({

		}).then(Eventos => {
			res.render('coord_ev/eventos/planificados', { 
				Usuario, 
				Eventos, 
				message: req.flash('info'),
				error: req.flash('error') 
			})
		})
	})
}

exports.deleteEvento = function(req, res) {
	models.evento.destroy({
		where: {
			id:req.params.id
		}
	}).then(Evento => {
		req.flash('error', 'Evento Eliminado Exitosamente!');
		res.redirect('/coord_ev/getEventos');
	})
}

exports.editEvento = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		models.evento.findOne({
			include: [ models.nucleo, models.tipoEvento ],
			where: {
				id: req.params.id
			}
		}).then(Evento => {
			models.nucleo.findAll({

			}).then(Nucleos => {
				models.tipoEvento.findAll({

				}).then(tipoEvent => {
					res.render('coord_ev/eventos/editar', { Usuario, Evento, Nucleos, tipoEvent });
				})
			})
		})
	})
}

exports.updateEvento = function(req, res) {
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/eventos',
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
				models.evento.update({
					nombre: req.body.nombre,
					direccion: req.body.direccion,
					fecha: req.body.fecha,
					nucleoCodigo: req.body.nucleo,
					publico: req.body.publico,
					tipoEventoId: req.body.tipo,
					cupos: req.body.cupos,
					descripcion: req.body.descripcion
				}, {
					where: {
						id: req.params.id
					}
				}).then(Evento => {
					console.log('=========Evento Actualizado Sin Img============');
					req.flash('info', 'Evento: '+req.body.nombre+' Actualizado Exitosamente');
					res.redirect('/coord_ev/getEventos');
				})
				console.log(req.file);
			} else{
				models.evento.update({
					nombre: req.body.nombre,
					direccion: req.body.direccion,
					fecha: req.body.fecha,
					nucleoCodigo: req.body.nucleo,
					publico: req.body.publico,
					tipoEventoId: req.body.tipo,
					cupos: req.body.cupos,
					descripcion: req.body.descripcion,
					files: req.file.filename
				}, {
					where: {
						id: req.params.id 
					}
				}).then(Evento => {
					console.log('============Evento Actualizado Con Img==============');
					req.flash('info', 'Evento: '+req.body.nombre+' Actualizado Exitosamente');
					res.redirect('/coord_ev/getEventos')
				}).catch(err => {
					console.log(err)
				});
			}
		}
	})
}

exports.instrumentos = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		models.instrument.findAll({
			include: [ models.categoria, models.tipoEval ]
		}).then(Instrumentos => {
			res.render('coord_ev/instrumento/home', { Usuario, Instrumentos });	
		})
	})
}

//Ruta para agregar Instrumento
exports.agregarInstrumento = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		models.categoria.findAll({

		}).then(Categorias => {
			models.tipoEval.findAll({

			}).then(Tipo => {
				res.render('coord_ev/instrumento/agregar', { Usuario, Categorias, Tipo });
			})
		});	
	})
}

//creando un nuevo instrumento de evaluacion
exports.createInstrument = function(req, res) {
	models.instrument.create({
		titulo: req.body.titulo,
		categoriumId: req.body.categoria,
		tipoEvalId: req.body.tipo
	}).then(Instrument => {
		models.instrument.findOne({
			order: [
				['id', 'DESC']
			]
		}).then(Instrumento => {
			res.redirect('/coord_ev/instrumento/' + Instrumento.id);
		})
	})
}

//2do Paso para la creación del instrumento de evaluación
exports.completarIntrumento = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		models.instrument.findOne({
			include: [ models.categoria, models.tipoEval ],
			where: { id: req.params.id }
		}).then(Instrumento => {
			models.categoria.findAll({

			}).then(Categorias => {
				models.tipoEval.findAll({

				}).then(Tipo => {
					models.factor.findAll({

					}).then(Factores => {
						res.render('coord_ev/instrumento/completar', { 
							Usuario, 
							Instrumento, 
							Categorias,
							Tipo, 
							Factores
						});
					})
				})	
			})
		})
	})
}

//agregando un nuevo factor
exports.addFactor = function(req, res) {
	//Pasos para transformar la primera letra de una cadena a mayuscula
		var cadena = req.body.factor;
		var minuscula = cadena.toLowerCase();
		var mayuscula = minuscula.charAt(0).toUpperCase() + minuscula.slice(1);

	models.factor.findOne({
		where: { nombre: mayuscula }
	}).then(Factor => {
		//Si el factor no existe en la DB
		if(Factor == undefined){
			models.factor.create({
				nombre: mayuscula
			}).then(Factor => {
				res.redirect('/coord_ev/instrumento/' + req.body.idInstrumento);
				//res.send('Factor');
			})
		} 
		//Si el Factor Existe en DB
		else{
			res.send('El factor existe');
		}
	});
}

//==================Ver Instrumento de Evaluación
exports.verInstrumento = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		res.render('coord_ev/instrumento/ver_2', { Usuario });
	})
}



//=================Aun sin definir el para q su uso
exports.editInstrumento = function(req, res) {
	models.usuario.findOne({
		include: [ models.nucleo, models.unidad ],
		where: {
			cedula: req.user.cedula
		}
	}).then(Usuario => {
		models.instrument.findOne({
			include: [ models.categoria, models.tipoEval ],
			where: { id: req.params.id }
		}).then(Instrumento => {
			models.categoria.findAll({

			}).then(Categorias => {
				models.tipoEval.findAll({

				}).then(Tipos => {
					res.render('coord_ev/instrumento/edit', { Usuario, Instrumento, Categorias, Tipos });
				})	
			})
		})	
	});
}

//=============Controladores axios
	//=============Solicitar Factores
	exports.getFactores = function(req, res) {
		models.factor.findAll({

		}).then(Factores => {
			res.json(Factores);
		})
	}

	//=============add Preguntas
	exports.addPregunta = function(req, res) {
		var Factor = req.body.factor;

		//buscando todos los Factores asociados a instrumentos en la tabla instrumentFactor
		models.instrumentFactor.findAll({
			
		}).then(instrumentFactor => {
			if (instrumentFactor.length > 0) {
				//res.send(instrumentFactor);
				for(var i = 0; i < instrumentFactor.length; i ++){
					if (instrumentFactor[i].factorId == Factor && instrumentFactor[i].instrumentId == req.params.id) {
						//res.send('no procede');
							models.item.create({
								nombre: req.body.nombre,
								valor: 0,
								factorId: req.body.factor,
								instrumentId: req.params.id
							}).then(Item => {
								res.json('Listo');
							})
					} else {
						//res.send('No Tiene conetenido');
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
								res.json('Listo');
							});
						});
					}
				}
			} else {
				//res.send('No Tiene conetenido');
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
						res.json('Listo');
					});
				});
			}
		})
	}

	//===============Ver Preguntas
	exports.getPreguntas = function(req, res) {
		//buscando un instrumento en especifico
		models.instrument.findById(req.params.id).then(Instruments => {
			//buscando todos los factores
			models.factor.findAll({

			}).then(Factores => {
				//buscando todos los items que pertenecen al instrumento que inicialmente buscamos
				models.item.findAll({
					include: [models.factor],
					order: [
						['id', 'ASC']
					],
					where: { instrumentId: req.params.id }
				}).then(Items => {
					res.json(Items)	
				})
			});
		});
	}

	//===========Obtener datos de un Instrumento determinado
	exports.getInstrumento = function(req, res) {
		models.instrument.findOne({
			include: [ models.categoria, models.tipoEval ],
			where: { id: req.params.id }
		}).then(Instrumento => {
			res.json(Instrumento);
		}).catch(err => {
			console.log(err);
		})
	}

	//==============Obtener todas las Categorias
	exports.getCategorias = function(req, res) {
		models.categoria.findAll({

		}).then(Categorias => {
			res.json(Categorias);
		}).catch(err => {
			console.log(err);
		})
	}

	//===============Obtener todos los Tipos de Evaluaciones
	exports.getTipos = function(req, res) {
		models.tipoEval.findAll({

		}).then(Tipos => {
			res.json(Tipos);
		}).catch(err => {
			console.log(err);
		})
	}

	//============Editar los Datos Principales de un Instrumento
	exports.updateInstrumento = function(req, res) {
		models.instrument.update({
			titulo: req.body.titulo,
			categoriumId: req.body.categoriumId,
			tipoEvalId: req.body.tipoEvalId
		}, {
			where: { id: req.params.id }
		}).then(Instrumento => {
			console.log('Instrumento Actualizado');
		}).catch(err => {
			console.log(err);
		})
	}

	//============Update una Pregunta en especifica
	exports.updatePregunta = function(req, res) {
		models.item.update({
			nombre: req.body.nombre,
			factorId: req.body.factorId,
		}, {
			where: { id: req.params.id }
		}).then(Item => {
			res.json(Item);
		}).catch(err => {
			console.log(err);
		})
	}

	//================Creando Factor por medio de Axios
	exports.crearFactor = function(req, res) {
		//Pasos para transformar la primera letra de una cadena a mayuscula
		var cadena = req.body.factor;
		var minuscula = cadena.toLowerCase();
		var mayuscula = minuscula.charAt(0).toUpperCase() + minuscula.slice(1);

		models.factor.findOne({
			where: { nombre: mayuscula }
		}).then(Factor => {
			//Si el factor no existe en la DB
			if(Factor == undefined){
				models.factor.create({
					nombre: mayuscula
				}).then(Factor => {
					res.json(Factor);
				})
			} 
			//Si el Factor Existe en DB
			else{
				res.json('Este Factor ya Existe');
			}
		});
	}

	//=============Eliminando Item
	exports.deleteItem = function(req, res) {
		models.item.destroy({
			where: { id: req.params.id }
		}).then(Item => {
			console.log('Eliminado');
		}).catch(err => {
			console.log(err);
		})
	}