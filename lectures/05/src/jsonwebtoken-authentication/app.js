const crypto = require('crypto');
const express = require('express')
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const cookie = require('cookie');

const jwt = require('jsonwebtoken');
var secret = "please change this secret";

const Datastore = require('nedb');
var users = new Datastore({ filename: 'db/users.db', autoload: true });

function generateSalt (){
    return crypto.randomBytes(16).toString('base64');
}

function generateHash (password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

app.use(function(req, res, next){
    req.user = null;
    var cookies = cookie.parse(req.headers.cookie || '');
    if (cookies.token){
        req.user = jwt.verify(cookies.token, secret);
    }
    next();
});

var isAuthenticated = function(req, res, next) {
    if (!req.user) return res.status(401).end("access denied");
    next();
};

// curl -X POST -d "username=admin&password=pass4admin" http://localhost:3000/signup/
app.post('/signup/', function (req, res, next) {
    // extract data from HTTP request
    if (!('username' in req.body)) return res.status(400).end('username is missing');
    if (!('password' in req.body)) return res.status(400).end('password is missing');
    var username = req.body.username;
    var password = req.body.password;
    // check if user already exists in the database
    users.findOne({_id: username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("username " + username + " already exists");
        // generate a new salt and hash
        var salt = generateSalt();
        var hash = generateHash(password, salt);
        // insert new user into the database
        users.update({_id: username},{_id: username, hash: hash, salt: salt}, {upsert: true}, function(err){
            if (err) return res.status(500).end(err);
            return res.end("account created");
        });
    });
});

// curl -X POST -d "username=admin&password=pass4admin" -c cookie.txt http://localhost:3000/signin/
app.post('/signin/', function (req, res, next) {
    // extract data from HTTP request
    if (!('username' in req.body)) return res.status(400).end('username is missing');
    if (!('password' in req.body)) return res.status(400).end('password is missing');
    var username = req.body.username;
    var password = req.body.password;
    // retrieve user from the database
    users.findOne({_id: username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("access denied");
        if (user.hash !== generateHash(password, user.salt)) return res.status(401).end("access denied"); // invalid password
        // generate a token and store it in a cookie
        var token = jwt.sign(user, secret);
        res.setHeader('Set-Cookie', cookie.serialize('token', String(token), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        }));
        return res.end("user " + username + " has been signed in");
    });
});

// curl -b cookie.txt -c cookie.txt  http://localhost:3000/signout/
app.get('/signout/', function(req, res, next){
    res.setHeader('Set-Cookie', cookie.serialize('token', String(''), {
        path: '/',
        maxAge: 0 // expire now
    }));
    return res.end("user has been signed out");    
});

// curl -b cookie.txt http://localhost:3000/private/
app.get('/private/', isAuthenticated, function (req, res, next) {
    return res.end("This is private");
});

// curl http://localhost:3000/public/
// curl -b cookie.txt http://localhost:3000/public/
app.get('/public/', function (req, res, next) {
    return res.end("This is public");
});

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
