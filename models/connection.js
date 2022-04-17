const mongoose = require('mongoose')

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

var identifiants = {
  mdp: 'XXX',
  identifiant: 'XXX',
  nomCluster: 'XXX',
}

// --------------------- BDD -----------------------------------------------------
mongoose.connect(
  `mongodb+srv://${identifiants.identifiant}:${identifiants.mdp}@cluster0.orqbr.mongodb.net/Ticketac?retryWrites=true`,
  options,
  function (err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`)
    } else {
      console.info('*** Database Ticketac connection : Success ***')
    }
  }
)
