var express = require('express');
var router = express.Router();
var userModel = require('../models/users')
const mongoose = require('mongoose');
var journeyModel = require('../models/journeys')


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET home page. */
router.get('/homepage', function(req, res, next) {
  if (req.session.user == null) {

    res.redirect('/')
  }
  else   {

  res.render('homepage')};
});


/* GET Journey page. */
router.post('/journey', async function(req, res, next) {

  if (req.session.user == null) {

    res.redirect('/')
  }
  else   
  {

  var departureOfJourney = req.body.departureCityFromFront
  var arrivalOfJourney = req.body.arrivalCityFromFront
  var dateOfJourney = req.body.dateFromFront

  var journey = await journeyModel.find({
  departure : departureOfJourney,
  arrival : arrivalOfJourney,
  date : dateOfJourney
  })

  if (journey.length == 0 ) {
    res.redirect('/oops')
  }else{

    req.session.journeyArray = [];
    for (var i=0; i<journey.length; i++){
req.session.journeyArray.push(journey[i])
    }

res.render('journey', {journeyArray : req.session.journeyArray} );}}
});


// // Remplissage de la base de donnée, une fois suffit
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 300

//   // Save  ---------------------------------------------------
//     for(var i = 0; i< count; i++){

//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

//     if(departureCity != arrivalCity){

//       var newUser = new journeyModel ({
//         departure: departureCity , 
//         arrival: arrivalCity, 
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });
       
//        await newUser.save();

//     }

//   }
//   res.render('index', { title: 'Express' });
// });


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
// router.post('/result', function(req, res, next) {

//   // Permet de savoir combien de trajets il y a par ville en base
//   for(i=0; i<city.length; i++){

//     journeyModel.find( 
//       { departure: city[i] } , //filtre
  
//       function (err, journey) {

//           console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
//       }
//     )

//   }

/* GET oops. */
router.get('/oops', function(req, res, next) {
  if (req.session.user == null) {

    res.redirect('/')
  }
  else   {
  res.render('oops'); }

  
});

/* GET mytickets. */
router.get('/mytickets', async function(req, res, next) {
  if (req.session.user == null) {

    res.redirect('/')
  }
  else   {
  

  var journeyElementFromList = await journeyModel.findById(req.query.idFromFront);

    var alreadyExist = false;


  if (!req.session.journeyticketsArray){
  req.session.journeyticketsArray = [];
  req.session.journeyticketsArray.push(journeyElementFromList)}

  for(var i = 0; i< req.session.journeyticketsArray.length; i++){
if (req.session.journeyticketsArray && req.session.journeyticketsArray[i]._id == journeyElementFromList._id ) 
{ 
  var alreadyExist = true; 
}
if (alreadyExist == false) 
{
  req.session.journeyticketsArray.push(journeyElementFromList)
}
}
  res.render('mytickets', {journeyticketsArray:req.session.journeyticketsArray})}; 

  
});



module.exports = router;
