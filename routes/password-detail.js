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

router.get('/delete/:id', checkLoginUer, function (req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var password_id = req.params.id;
    var passwordDelete = passModel.findByIdAndDelete(password_id);
    passwordDelete.exec((err)=>{
      if (err) throw err;
      res.redirect('/view-all-password');
    });
  });
  
  router.get('/edit/:id', checkLoginUer, function (req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var getPassword = passModel.findById({_id : id});
    getPassword.exec((err, data)=>{
      if (err) throw err;
      getPasscat.exec((err, data1)=>{
      res.render('edit-password-details', { title : 'Password Management System', loginUser : loginUser, success : '', record : data, records : data1})
      });
    });
  });
  
  router.post('/edit/:id', checkLoginUer, function (req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
    passModel.findByIdAndUpdate(id,{password_category : pass_cat, project_name : project_name, password_details : pass_details}).exec(function(err){
      if (err) throw err;
    var getPassword = passModel.findById({_id : id});
    getPassword.exec((err, data)=>{
      if (err) throw err;
      getPasscat.exec((err, data1)=>{
      res.render("edit-password-details", { title : 'Password Management System', loginUser : loginUser, success : 'Password Details Updated Successfully', record : data, records : data1})
      });
    });
    });
  });
  

module.exports = router;