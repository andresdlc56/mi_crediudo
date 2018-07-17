var exports = module.exports = {}

var models = require('../models');

exports.index = function(req, res) {
	res.render('coord_ev/index');
}