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
     getPasscat.exec((err, data)=>{
       if (err) throw err;
       res.render('password_category', { title : 'Password Management System', loginUser : loginUser, records : data});
     });
  });

  router.get('/delete/:id', function (req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var passdelete = passcatModel.findByIdAndDelete(passcat_id);
    passdelete.exec(function(err){
     if (err) throw err;
    res.redirect('/password_category');
    });
  });
  
  router.get('/edit/:id', function (req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var getpassCategory = passcatModel.findById(passcat_id);
    getpassCategory.exec((err, data)=>{
      if (err) throw err;
    res.render('edit-pass-category', { title : 'Password Management System', loginUser : loginUser, id : passcat_id, errors :'', success : '', records : data});
   });
  });
  
  router.post('/edit/', function (req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.body.id;
    var passwordCategory = req.body.passwordCategory
    var update_passCat = passcatModel.findByIdAndUpdate(passcat_id, {password_category : passwordCategory});
    update_passCat.exec(function(err, doc){
      if (err) throw err;
      res.redirect('/password_category');
    })
  });

module.exports = router;