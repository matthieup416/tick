var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var journeysModel = require('../models/journeys')

var userModel = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/sign-up', async function(req,res,next){
  console.log(req.session.user)

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    
  })
  
  if(!searchUser){
    var newUser = new userModel({
      name: req.body.nameFromFront,
      firstname: req.body.firstnameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    var newUserSave = await newUser.save();
  
    req.session.user = {
      name: newUserSave.name,
      id: newUserSave._id,
    }
  
    
  
    res.render('homepage', {user:req.session.user})
  } else {
    res.render('/')
  }
  
});

router.post('/sign-in', async function(req,res,next){
  

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchUser!= null){
    req.session.user = {
      name: searchUser.name,
      id: searchUser._id
    }
    res.render('homepage',{user:req.session.user})
  } else {
    res.redirect('/')
  }

  console.log(req.session.user);
});

router.get('/logout', function(req,res,next){

  req.session.user = null;

  res.redirect('/')
});


module.exports = router;
