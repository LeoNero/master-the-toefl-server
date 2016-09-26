'use strict'

const express         = require('express');
const path            = require('path');
const logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const mongoose        = require('mongoose');
const methodOverride  = require('method-override');
const expressSession  = require('express-session');
const helmet          = require('helmet');
const config          = require('./config/config.js');

const app = express();

let corsOptions = {
  origin: function(origin, callback) {
    let originIsWhitelisted = ['http://localhost:9000', 'http://masterthetoefl.xyz', 'https://masterthetoefl.xyz', 'www.masterthetoefl.xyz', 'https://www.masterthetoefl.xyz'].indexOf(origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(express.static(path.join(__dirname, '/uploads')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(helmet());
app.use(helmet.hidePoweredBy({setTo: 'PHP 5.5.10'}));
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
//app.use(helmet.nosniff());
app.use(expressSession({
  secret: config.SESSION_SECRET, 
  name: config.SESSION_KEY, 
  resave: false, 
  saveUninitialized: false
}));

app.set('port', process.env.PORT || 3000);

require('./routes/auth')(app, corsOptions);
require('./routes/api')(app, corsOptions);
require('./routes/admin')(app);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/master-the-toefl');

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
