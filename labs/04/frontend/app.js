const express = require('express');
const app = express();

app.use(express.static('frontend'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
});

app.post('/', function (req, res, next) {
    res.json(req.body);
});

app.post('/api/messages/', function (req, res, next) {
    var auth = req.body.author;
    var content = req.body.content;
    var m = api.addMessage(auth, content);
    var ret = {"id": m.id};
    
    res.json(ret);
});

app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
