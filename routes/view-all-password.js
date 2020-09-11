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

router.get('/', checkLoginUer, function (req, res, next){
  var loginUser = localStorage.getItem('loginUser');
  var options = {
   offset : 1,
   limit : 2,
 }
 passModel.paginate({}, options).then(function(result){
  res.render('view-all-password', { title : 'Password Management System', loginUser : loginUser,
   records : result.docs,
  current : result.offset,
  pages : Math.ceil (result.total / result.limit)
  });
 });
});

router.get('/:page', checkLoginUer, function (req, res, next){
  var loginUser = localStorage.getItem('loginUser');
   
  var perPage = 3;
  var page = req.params.page || 1;

  getPassword.skip((perPage * page) - perPage)
  .limit(perPage).exec(function(err, data){
    if (err) throw err;
    passModel.countDocuments({}).exec((err, count) => {
  res.render('view-all-password', { title : 'Password Management System', loginUser : loginUser,
   records : data,
  current : page,
  pages : Math.ceil(count / perPage)
  });
  });
 });
});



module.exports = router;