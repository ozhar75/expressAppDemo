var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

// var logger = function(req, res, next){
//     console.log('Logging..');
//     next();
// }

// app.use(logger);

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//Global variables
app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
})

//Express validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//var users = [
//    {
//        id: 1,
//        first_name: "Akshay",
//        last_name: "Dhonde",
//        email: "ozhar75@gmail.com"
//    },
//    {
//        id: 2,
//        first_name: "Ankit",
//        last_name: "Dhonde",
//        email: "ankit31@gmail.com"
//    },
//    {
//        id: 3,
//        first_name: "Pratik",
//        last_name: "Deshmukh",
//        email: "pratik@gmail.com"
//    }
//]

// var person = [
//     {
//         name : "Akshay",
//         age : 30
//     },
//     {
//         name : "Ankit",
//         age : 25
//     }
// ]

app.get('/', function (req, res) {
    db.users.find(function (err, docs) {
        res.render('index', {
            title: "Customers",
            users: docs
        });
    });
});

app.post('/users/add', function (req, res) {
    req.checkBody('first_name', 'First name is required').notEmpty();
    req.checkBody('last_name', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('index', {
            title: "Customers",
            users: users,
            errors: errors
        });
    } else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }

        db.users.insert(newUser, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
        console.log('SUCCESS');
    }
});

app.delete('/users/delete/:id', function (req, res) {
    db.users.remove({
        _id: ObjectId(req.params.id)
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(3000, function () {
    console.log("Server running");
});