var express = require('express');
var router = express.Router();
var userModel = require('../models/users')
var journeyModel = require('../models/journeys')


/* GET Login page. */
router.get('/', function(req, res, next) {
  if (req.session.user == undefined){
    res.render('login', {user: req.session.user});

  }
  else {
    res.render('homepage', {user: req.session.user})
  }
});

/* GET home page. */
router.get('/homepage', function(req, res, next) {

  if(req.session.user == undefined) {
    req.session.user = [];
  }

  res.render('homepage', {user:req.session.user });
});


/* GET Journey page. */
router.post('/journey', async function(req, res, next) {

  if (req.session.user == null) {

    res.render('login', {user: req.session.user})
  }
  
   
  var departureOfJourney = req.body.departureCityFromFront
  var arrivalOfJourney = req.body.arrivalCityFromFront
  var dateOfJourney = req.body.dateFromFront

  var journey = await journeyModel.find({
  departure : departureOfJourney,
  arrival : arrivalOfJourney,
  date : dateOfJourney
  })

  req.session.journeyArray = []
console.log('journeys found : ', journey)
  if (journey.length == 0 ) {
    res.redirect('/oops')
  }else{
    for (var i=0; i<journey.length; i++){
req.session.journeyArray.push(journey[i])
    }

res.render('journey', {journeyArray : req.session.journeyArray, user: req.session.user} );}
});





/* GET oops. */
router.get('/oops', function(req, res, next) {
  if (req.session.user == null) {

    res.redirect('/')
  }
  else   {
  res.render('oops', {user: req.session.user}); }

  
});

router.get('/mytickets', async function(req, res, next) {
  if (req.session.user == null) {

    res.redirect('/')
  }

    if(req.session.journeyticketsArray == undefined){
      req.session.journeyticketsArray = []
    }

    
    var journeyElementFromList = await journeyModel.findById(req.query.idFromFront);
    req.session.journeyticketsArray.push(journeyElementFromList)
  

  res.render('mytickets', {journeyticketsArray:req.session.journeyticketsArray, user: req.session.user}); 
});

router.get('/deleteFromMyTickets', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect('/')
  }
  var idx = req.session.journeyticketsArray.findIndex(p => p._id == req.query.idToDelete);
  req.session.journeyticketsArray.splice(idx,1); 
  res.render('mytickets', {journeyticketsArray:req.session.journeyticketsArray, user: req.session.user}); 
})


// AJOUTER LES CLES ETRANGERES DANS USERJOURNEYS
router.get('/confirmation', async function(req, res, next) {
console.log(req.session.journeyticketsArray)

var userID = req.session.user._id
  console.log(userID);
  for (var i=0; i<req.session.journeyticketsArray.length; i++){
    var journeyID = req.session.journeyticketsArray[i]._id
    var searchUser = await userModel.updateOne({_id: userID}, {$push: {userJourneys: journeyID}})
  }
  req.session.journeyticketsArray = []
res.redirect('/homepage')  
});


// LIRE L'HISTORIQUE DES VOYAGES
router.get('/mylasttrips', async function(req, res, next) {
  var userID = req.session.user._id
  var userTest = await userModel.findById(userID).populate('userJourneys').exec()
  var tab = []
  for (var i = 0; i<userTest.userJourneys.length; i++) {
  var journey = await journeyModel.findById(userTest.userJourneys[i])
  tab.push(journey)
}
res.render('mylasttrips', {user: req.session.user, userJourneys : tab});
});


// SUPPRIMER UN VOYAGE DE L'HISTORIQUE
router.get('/deleteTrip', async function(req, res, next) {
  var userID = req.session.user._id
  var user = await userModel.findById(userID).populate('userJourneys').exec()

  // On pourrait utiliser .pull() mais cette méthode supprime toutes les occurences, 
  //donc supprimera plusieurs voyages qui auraient le meme _id (doublons)
  // On contourne cet obstacle en utilisant findIndex() puis .splice()
  var idx = user.userJourneys.findIndex(p => p._id == req.query.tripId);
  user.userJourneys.splice(idx,1); 
  var userSaved = await user.save()
  
  res.render('mylasttrips', {user: req.session.user, userJourneys : userSaved.userJourneys});      
  });




module.exports = router;
