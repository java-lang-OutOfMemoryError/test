var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


let mikhail = {
  fullName: "Mikhail Glebov",
  fullBio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  profilePicURL: "https://my-content.s3.amazonaws.com/stockProfilePic.png"
}

let john = {
  fullName: "John Doe",
  fullBio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  profilePicURL: "https://my-content.s3.amazonaws.com/stockProfilePic.png"
}

let bob = {
  fullName: "Bob Smith",
  fullBio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  profilePicURL: "https://my-content.s3.amazonaws.com/stockProfilePic.png"
}

let users = [mikhail, john, bob]

// app.get('/', (req, res, next) => {
//   res.render('index', { users: users });
// });


// *****************************************************************************
// db Operations
// *****************************************************************************
const { MongoClient } = require('mongodb');

const url = 'mongodb://mongo:27017/';
//const url = 'mongodb://myuser:mypassword@mongo:27017/'; 
//  GET THE HOSTNAME, username & password & the DB name from environment vars. 
// Example: console.log(process.env.NODE_ENV);

const dbName = 'userProfiles';
const client = new MongoClient(url);
let findResult;

app.get('/db', async function (req, res, next) {
  try {

    const usersCopy = JSON.parse(JSON.stringify(users));

    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('users');

    const insertResult = await collection.insertMany(usersCopy);

    console.log('Inserted documents =>', insertResult);

    findResult = await collection.find({}).toArray();
    res.send(findResult);
    // res.render('index', { users: findResult });

  } catch (error) {
    console.log(error);
    next(error)
  } finally {
    client.close()
  }

});

app.get('/', async function (req, res, next) {
  try {

    const usersCopy = JSON.parse(JSON.stringify(users));

    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('users');

    const insertResult = await collection.insertMany(usersCopy);

    console.log('Inserted documents =>', insertResult);

    findResult = await collection.find({}).toArray();
    //    res.send(findResult);
    res.render('index', { users: findResult });

  } catch (error) {
    console.log(error);
    next(error)
  } finally {
    client.close()
  }

});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
