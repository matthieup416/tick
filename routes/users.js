var express = require('express');
var router = express.Router();

var userModel = require('../models/users')

router.post('/sign-up', async function(req,res,next){
  console.log(req.session.user)

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
  })
  
  if(!searchUser){
    var newUser = new userModel({
      name: req.body.nameFromFront,
      firstName: req.body.firstnameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
   await newUser.save();

    req.session.user = newUser
  
    res.render('homepage', {user:req.session.user})
  } else {

    res.render('login', { user:req.session.user });
  }
  
});

router.post('/sign-in', async function(req,res,next){
  var searchUser = await userModel.find({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchUser.length > 0){
    req.session.user = searchUser[0]
    res.render('homepage',{user:req.session.user})
  } else {
    res.render('login', {user: req.session.user})
  }
});

router.get('/logout', function(req,res,next){

  req.session.user = null;

  res.render('login', {user: req.session.user})
});


module.exports = router;
