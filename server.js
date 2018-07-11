var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var env = require('dotenv').load();

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', './app/views')
app.engine('html', require('ejs').renderFile);// para usar html en vez de jade como motor de plantilla
app.set("view engine", "html");

app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});

//Models
var models = require("./app/models");

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