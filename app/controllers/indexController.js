var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
    models.evaluacion.findAll({

    }).then(Evaluaciones => {
    	
    	res.render('index/indexPedro', { Evaluaciones });	
    })
    
    //res.send('Ruta Index');
}