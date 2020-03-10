
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://baqudo:Z0gmdFELIin0pTDf@cluster0-uyzdi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log(collection)
  client.close();
});


// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });

// var kittySchema = new mongoose.Schema({
//     name: String
//   });

// kittySchema.methods.speak = function () {
// var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
// console.log(greeting);
// }

// var Kitten = mongoose.model('Kitten', kittySchema);

// var silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'


// var Kitten = mongoose.model('Kitten', kittySchema);

// var fluffy = new Kitten({ name: 'fluffy' });
// fluffy.speak(); // "Meow name is fluffy"

// fluffy.save(function (err, fluffy) {
// if (err) return console.error(err);
// fluffy.speak();
// });

// Kitten.find(function (err, kittens) {
//     if (err) return console.error(err);
//     console.log(kittens);
// })

// const callback = () => console.log('kek')

// Kitten.find({ name: /^fluff/ }, callback);