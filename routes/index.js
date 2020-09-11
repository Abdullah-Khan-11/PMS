var express = require('express');
var userModel = require('../module/user');
var passCatModel = require('../module/passwordCategory');
var passModel = require('../module/addPassword');
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const passcatModel = require('../module/passwordCategory');
var router = express.Router();
var getPasscat = passCatModel.find({});
var getPassword = passModel.find({});

/* GET home page. */

function checkLoginUer(req, res, next){
  var userToken = localStorage.getItem('userToken');
  try {
     var decoded = jwt.verify(userToken, 'loginToken');
  } catch (err){
     res.redirect('/');
  }
  next ();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


function checkUsername(req, res, next){
 var username = req.body.uname;
 var checkExituser = userModel.findOne({username : username});
 checkExituser.exec((err, data)=>{
   if (err) throw err;
   if (data){
     return res.render('signup', { title : 'Password Management System', msg : 'Username are taken'});
   }
   next();
 });
}

function checkEmail(req, res, next){
  var email = req.body.email;
  var checkExitemail = userModel.findOne({email : email});
  checkExitemail.exec((err, data)=>{
    if (err) throw err;
    if (data) {
      return res.render('signup', { title : 'Password Management System', msg : 'Email are taken'});
    }
    next();
  });
}


router.get('/',  function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
  res.render('index', { title: 'Password Management System', loginUser : loginUser, msg : '' });
  }
});

router.post('/', function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUserModel = userModel.findOne({username : username});
  checkUserModel.exec((err, data)=>{
    if (err) throw err;
    
    var getUserID = data._id;
    var getPassword = data.password;
    if(bcrypt.compareSync(password, getPassword)){
      var token = jwt.sign({userID : getUserID}, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', username);
     res.redirect('/dashboard');
    }else{
    res.render('index', { title : "Password Management System", msg : "Error"});
    }
  });
});

router.get('/signup', function (req, res, next){
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dasboard');
  }else{
  res.render('signup', { title : 'Password Management System', loginUser : loginUser, msg : ''});
  }
});

router.post('/signup', checkUsername, checkEmail, function (req, res, next){
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confPassword = req.body.confpassword;
  
  if (password != confPassword){
    res.render('signup', { title : 'Password Management System', msg : 'Password Does Not Match'});
  }else{
    password = bcrypt.hashSync(req.body.password, 10);
  var userDetails = new userModel({
    username : username,
    email : email,
    password : password
  });
  userDetails.save((err, doc)=>{
    if (err) throw err;
    res.render('signup', { title : 'Password Management System', msg : 'User Inserted Successfully'});
  });  
 }
});

router.get('/logout', function (req, res, next){
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;
