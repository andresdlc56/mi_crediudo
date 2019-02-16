var exports = module.exports = {}

var models = require('../models');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

exports.index = function(req, res) {
    models.evaluacion.findAll({

    }).then(Evaluaciones => {
    	
    	res.render('index/index', { Evaluaciones });	
    })
    
    //res.send('Ruta Index');
}

exports.olvidePassword = function(req, res) {
	res.render('index/resetPassword');
}

exports.forgot = function(req, res, next) {
	async.waterfall([
	    function(done) {
	      crypto.randomBytes(20, function(err, buf) {
	        var token = buf.toString('hex');
	        done(err, token);
	      });
	    },
	    function(token, done) {
	    	models.usuario.findOne({
	    		where: { email: req.body.email }
	    	}).then(user => {
	    		if(!user) {
	    			//req.flash('error', 'No account with that email address exists.');
	          		return res.redirect('/forgot');
	    		}

	    		user.resetPasswordToken = token;
	        	user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	        	models.usuario.update({
	        		resetPasswordToken: token,
	        		resetPasswordExpires: user.resetPasswordExpires
	        	}, {
	        		where: { email: req.body.email }
	        	}).then(Actualizado => {
	        		res.json('Token Actualizado');
	        	}).catch(err => {
	        		console.log(err);
	        	});
	    	});
	    },

	    
	    function(token, user, done) {
	      var smtpTransport = nodemailer.createTransport('SMTP', {
	        service: 'Gmail',
	        auth: {
	          user: '!!! TU NOMBRE DE USUARIO DE SENDGRID !!!',
	          pass: '!!! TU CONTRASEÑA DE SENDGRID !!!'
	        }
	      });
	      var mailOptions = {
	        to: user.email,
	        from: 'andresdlc56@gmail.com',
	        subject: 'Node.js Password Reset',
	        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
	          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	      };
	      smtpTransport.sendMail(mailOptions, function(err) {
	        //req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
	        done(err, 'done');
	      });
	    }
  	], function(err) {
	    if (err) return next(err);
	    res.redirect('/forgot');
  	});
}