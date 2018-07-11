var exports = module.exports = {}

exports.signup = function(req, res) {
    res.render('signup');
}

exports.signin = function(req, res) {
    res.render('index/login');
}

exports.dashboard = function(req, res) {
	var usuario = req.user;

	//si el rol del usuario es 1 (admin)
	if (usuario.rolId == 1) {
		res.redirect('/admin');
		//res.render('dashboard', { usuario });	
	} else{
		res.status(201).send('No es Usuario admin');
	}
	//res.send('home | admin');
	
	//res.status(201).send(req.user);
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}