// Server doesn't work, because apparently phantomjs is not sending the cookies
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
  return next();
});

app.use(cookieParser());

app.get('*', function (req, res) {
  console.log(req.cookies);
  res.json(req.cookies);
});

app.listen(3000);
