var bCrypt = require('bcrypt-nodejs');
var modelUsuario = require('../../models/usuario');
var modelRol = require('../../models/rol');

module.exports = function(passport, user) {
 
    var Usuario = user;
    var LocalStrategy = require('passport-local').Strategy;
    
    
    passport.use('local-signup', new LocalStrategy(
 
        {
            usernameField: 'cedula',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
 
 
 
        function(req, cedula, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
 
 
            Usuario.findOne({
                where: {
                    cedula: cedula
                }
            }).then(function(user) {
 
                if (user)
                {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
 
                } else
 
                {
                    var userPassword = generateHash(password);
                    var data =
                        {
                            cedula: cedula,
                            password: userPassword,
                            nombre: req.body.nombre,
                            apellido: req.body.apellido,
                            email: req.body.email
                        };
 
                    Usuario.create(data).then(function(newUser, created) {
 
                        if (!newUser) {
                            return done(null, false);
                        }
 
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
    
    
    //serialize
    passport.serializeUser(function(user, done) {
        done(null, user.cedula);
    });

    // deserialize user 
    passport.deserializeUser(function(cedula, done) {
        Usuario.findOne({
            include: [modelRol.Rol],
            where:{cedula:cedula}
        }).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
     
        {
            /*
                De forma predeterminada, la estrategia local utiliza un nombre de usuario y una contraseña, 
                los anularemos con el correo electrónico
            */
            usernameField: 'cedula',
            passwordField: 'password',
            passReqToCallback: true // nos permite pasar la solicitud completa a la devolución de llamada
        },

        function(req, cedula, password, done){
            var Usuario = user;
            var isValidPassword = function(userpass, password) { 
                return bCrypt.compareSync(password, userpass);
            }

            Usuario.findOne({
                include: [modelRol.Rol],
                where:{cedula: cedula}
            }).then(function(user){

                if (!user) {
                    return done(null, false, {
                        message: 'Esta Cedula No Existe'
                    });
                }

                
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Contraseña Incorrecta'
                    });
                }
                
                var empleadoinfo = user.get();
                return done(null, empleadoinfo);

            }).catch(function(err) {
                console.log("Error:", err);
     
                return done(null, false, {
                    message: 'Algo salió mal con tu Inicio de Sesión'
                });
            });
        }
    ));

    //LOCAL SIGNINCrediudo
    passport.use('local-signinCrediudo', new LocalStrategy(
     
        {
            /*
                De forma predeterminada, la estrategia local utiliza un nombre de usuario y una contraseña, 
                los anularemos con el correo electrónico
            */
            usernameField: 'cedula',
            passwordField: 'password',
            passReqToCallback: true // nos permite pasar la solicitud completa a la devolución de llamada
        },

        function(req, cedula, password, done){
            var Usuario = user;
            var isValidPassword = function(userpass, password) { 
                return bCrypt.compareSync(password, userpass);
            }

            Usuario.findOne({
                include: [modelRol.Rol],
                where:{cedula: cedula}
            }).then(function(user){

                if (!user) {
                    return done(null, false, {
                        message: 'Esta Cedula No Existe'
                    });
                }

                
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Contraseña Incorrecta'
                    });
                }

                if(user.crediudo === false) {
                    return done(null, false, {
                        message: 'Usted no es Usuario CREDIUDO'
                    });
                }
                
                var empleadoinfo = user.get();
                return done(null, empleadoinfo);

            }).catch(function(err) {
                console.log("Error:", err);
     
                return done(null, false, {
                    message: 'Algo salió mal con tu Inicio de Sesión'
                });
            });
        }
    ));
}