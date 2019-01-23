var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.get('/hello', function(req, res){
   res.send("Hello 5World!");
app.listen(3000);
