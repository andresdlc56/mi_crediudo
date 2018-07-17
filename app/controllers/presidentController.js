var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
	res.render('president/index'); 
}