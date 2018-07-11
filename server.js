var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', './app/views')
app.engine('html', require('ejs').renderFile);// para usar html en vez de jade como motor de plantilla
app.set("view engine", "html");

app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});

app.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});