// server.js
// where your node app starts

// init project
const express = require('express');
var favicon = require('serve-favicon')
var path = require('path')
const app = express();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
var responseTime = require('response-time')
var session = require('express-session')
var timeout = require('connect-timeout')
var rid = require('connect-rid');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bodyParser = require('body-parser')


const adapter = new FileSync('.data/db.json')
const db = low(adapter)

passport.use(new LocalStrategy(
  function(username, password, done) {
    let user = db.get('users').find({ username: username, password: password }).value()
    let temp = {username: user.username, password: user.password}
    
    if(temp == undefined) {
      console.log("user does not exist!")
      return "undefined"
    }
    
    if (temp.username != username) { 
      return done(null, false); 
    }
    if (temp.password != password) { 
      return done(null, false); 
    }
    return done(null, temp);
  }
));

// app.use(favicon(__dirname + '/public/images/favicon.ico'))
app.use(responseTime())
var sess = {
  secret: 'test_session',
  cookie: { secure: true, name: "this is the cookie!", maxAge: 9999999 }
}
app.use(session(sess))
app.use(timeout('15s'))
app.use(rid({'header-name': "test header"}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

function binary(str) {
  return str.split(/\s/g).map((x) => x = String.fromCharCode(parseInt(x, 2))).join("");
}

function hashFunction(string) {
  var pass = ''
  var bin = ''
  if(string == '') {
    string = 'empty'
  }
  for (var i = 0; i < string.length; i++) {
    bin += string[i].charCodeAt(0).toString(2) + " ";
  }

  for (var i = 0; i < bin.length; i++) {
    if(bin[i] == '1') {
      pass += '0'
    }
    else if(bin[i] == '0') {
      pass += '1'
    }
  }

  // return bin
  return binary(pass);
}

var temp1 = "testing"
var out = hashFunction(temp1)

console.log(hashFunction(out))

out = hashFunction(out)

console.log(out)

function login(username, password) {
  var exists = 'false'
  var users = db.get('users').value() // Find all users in the collection
  users.forEach(function(user) {
    if(user.username == username && user.password == password) {
      console.log(user.username + " to " + username)
      exists = 'true'
    }
    // [user.firstName,user.lastName]); // adds their info to the dbUsers value
  });
  return exists
}

// serialize user object
passport.serializeUser(function (user, done) {
  done(null, user);
});

// deserialize user object
passport.deserializeUser(function (user, done) {
  done(null, user);
});

function isAdmin(username) {
  var isAdmin = false
  var users = db.get('users').value() // Find all users in the collection
  users.forEach(function(user) {
    if(user.username == username && user.admin == true) {
      console.log(user.username + " to " + username)
      isAdmin = true
    }
    // [user.firstName,user.lastName]); // adds their info to the dbUsers value
  });
  return isAdmin
}

function getUsers() {
  return db.get('users').value() // Find all users in the collection
}

function findUser(username) {
  return db.get('users').find({username: username}).value()
}

// default user list
db.defaults({ users: [
      {"username":"admin", "password":"admin", "admin":"true"},
      {"username":"ice", "password":"ice", "admin":"true"},
      {"username":"test", "password":"test", "admin":"false"},
      {"username":"a", "password":"a", "admin":"false"}
    ]
  }).write();

app.get("/users", function (request, response) {
  console.log("getting users...")
  var dbUsers=[];
  var users = db.get('users').value() // Find all users in the collection
  // users.forEach(function(user) {
  //   dbUsers.push([user.username,user.password,user.admin]); // adds their info to the dbUsers value
  // });
  response.send(users); // sends dbUsers back to the page
});

// removes entries from users and populates it with default users
app.get("/reset", function (request, response) {
  // removes all entries from the collection
  db.get('users')
  .remove()
  .write()
  console.log("Database cleared");
});

const testdata = [
  {username: "admin", password: "admin", admin: true},
  {username: "notadmin", password: "notadmin", admin: false}
]

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
// app.get('/', function(request, response) {
//   response.sendFile(__dirname + '/views/sample.html');
// });

app.get('/', function(request, response) {
  console.log("cookie name: " + request.session.cookie.name)
  console.log("did request time out?: " + request.timedout)
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/login_page', function(request, response) {
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/registration_page', function(request, response) {
  response.sendFile(__dirname + '/views/register.html');
});

app.get('/login_admin', function(request, response) {
  response.sendFile(__dirname + '/views/admin.html');
});

app.get('/login_user', function(request, response) {
  response.sendFile(__dirname + '/views/user.html');
});

app.post('/login', passport.authenticate('local'), function (req, res) {
  console.log('got POST request')
  
  let dataString = ''
  
    // dataString += data 
    
    console.log(req.body)
    
    var json=req.body
    
    console.log(dataString)
    
    var response = ''
    
    if(login(json.username, json.password) == 'true') {
      console.log(json.admin)
      // return json saying login successful, redirect to logged in page
      // res.send('logged in successfully!') 
      response = {status: "logged in successfully!", admin: isAdmin(json.username)}
      console.log(response)
      res.send(response)
    }
    else {
      // return json saying login failed, refresh page
      // res.send('could not log in. wrong username/password.')
      response = {status: "login failed. incorrect username or password."}
      console.log(response)
      res.send(response)
    }
    
    // console.log(login(json.username, json.password))
  })

app.post('/register', function (req, res) {
  // res.send('Got a POST request')
  console.log('got POST request')
  
  let dataString = ''
  
  req.on( 'data', function( data ) {
    dataString += data 
    console.log(dataString)
    
    var json=JSON.parse(dataString)
    
    // console.log(json.username)
    // console.log(json.password)
    
    //write to database here
   
    console.log("focus! " + db.get('users').find({username: json.username}).value())
    
    if(db.get('users').find({username: json.username}).value() == undefined) {
        db.get('users')
          .push({username: json.username, password: json.password, admin: "false"})
          .write()
      console.log("new user created!")
      res.send("new user created!")
    }
    else {
      console.log("username already exists!")
      res.send("username already exists! could not create account!")
    }
    
    })
  
});

app.post('/delete', function (req, res) {
//   res.send('Got a POST request')
  console.log('got POST request')
  
  let dataString = ''
  
  req.on( 'data', function( data ) {
    dataString += data 
    console.log(dataString)
    
    var json=JSON.parse(dataString)
    
    db.get('users')
      .remove({username: json.username})
      .write()
    })
  res.send("user deleted!")
});

app.post('/update', function (req, res) {
//   res.send('Got a POST request')
  console.log('got POST request')
  
  let dataString = ''
  
  req.on( 'data', function( data ) {
    dataString += data 
    console.log(dataString)
    
    var json=JSON.parse(dataString)
    
    var user = db.get('users').find({username: json.username}).value()
    
    // console.log(user.admin)
    
    if(user != undefined) {
      if(user.admin == true) {
        console.log(user.admin)
        db.get('users')
          .find({ username: json.username, admin: true })
          .assign({ admin: false})
          .write()
        console.log(user.admin)
        res.send(user.username + " is no longer an admin!")
      }
      else {
        console.log(user.username)
        console.log(user.admin)
        db.get('users')
          .find({ username: json.username })
          .assign({ admin: true})
          .write()
        console.log(user.admin)
        res.send(user.username + " is now an admin!")
      }
    }
    
    })
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
