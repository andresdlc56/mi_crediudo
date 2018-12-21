var express = require('express');
var app = express();
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var multer = require('multer'); //para el manejo de multipart/form usado para cargar archivos
var path =require('path');
var flash = require('connect-flash');

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash());
app.use(express.static(path.join(__dirname, 'public'))); // lo declaramos para utilizar archivos estaticos dentro de la aplicacion.
app.set('views', './app/views')
app.engine('html', require('ejs').renderFile);// para usar html en vez de jade como motor de plantilla
app.set("view engine", "html");

/*
app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});
*/

//Models
var models = require("./app/models");

//Routes
var authRoute = require('./app/routes/auth.js')(app,passport);

//Routes
var Index = require('./app/routes/index.js')(app,passport);
var admin = require('./app/routes/admin/index.js')(app);
var presi = require('./app/routes/president/index.js')(app);
var coord_ev = require('./app/routes/coord_ev/index.js')(app);
var coord_plani = require('./app/routes/coord_plani/index.js')(app);
var empleado = require('./app/routes/empleado/index.js')(app);

//load passport strategies
require('./app/config/passport/passport.js')(passport,models.usuario);

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});

app.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});