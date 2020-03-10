var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options')).
    catch(error => console.log(error));


module.exports = mongoose;
