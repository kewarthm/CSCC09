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
    
    res.json(m);
});

app.get('/api/messages/', function (req, res, next) {
    var ret = api.getMessages();
    res.json(ret);
});

app.get('/api/messages/:id', function (req, res, next) {
    var id = req.params.id;
    var ret = api.getMessage(id);
    if(ret === undefined) res.status(404).end("message :" + id + " does not exist");
    res.json(ret);
});

app.delete('/api/messages/:id', function (req, res, next){
    var id = req.params.id;
    var m = api.deleteMessage(id);
    if(m == null) return res.status(404).end("message :" + id + " does not exist");
    else{
        res.json(m);
    }
});

app.patch('/api/messages/:id', function (req, res, next) {
    var action = req.body.action;
    var id = req.params.id;
    if(action == 'upvote'){
        var m = api.upvoteMessage(id);
        if (m === undefined) return res.status(404).end("message :" + id + " does not exist");
    }
    else if(action = 'downvote'){
        var m = api.downvoteMessage(id);
        if (m === undefined) return res.status(404).end("message :" + id + " does not exist");
    }
    else return res.status(204).end("body: invalid argument");
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
