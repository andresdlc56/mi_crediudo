var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
    models.evaluacion.findAll({

    }).then(Evaluaciones => {
    	models.noticia.findAll({
    		limit: 4,
			order: [['id', 'DESC']] 
    	}).then(Noticias => {
    		res.render('index/index', { Evaluaciones, Noticias });
    	})	
    })
    
    //res.send('Ruta Index');
}