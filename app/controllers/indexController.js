var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
    models.evaluacion.findAll({

    }).then(Evaluaciones => {
    	
    	res.render('index/index', { Evaluaciones });	
    })
    
    //res.send('Ruta Index');
}