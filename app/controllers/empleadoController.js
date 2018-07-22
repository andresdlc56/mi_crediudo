var exports = module.exports = {}

var models = require('../models');

exports.evaluacion = function(req, res) {
	models.usuario.findById(req.params.idu).then(Usuario => {
		models.evaluacion.findById(req.params.id).then(Evaluacion => {
			if (Usuario.nucleoCodigo == Evaluacion.nucleoCodigo && Usuario.unidadCodigo == Evaluacion.unidadCodigo) {
				res.render('empleado/evaluacion/index', { Usuario, Evaluacion });	
			} else{
				res.send('Negativo');
			}	
		})
	})
}
