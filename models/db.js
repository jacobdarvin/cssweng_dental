const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/practice';

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const database = {

    connect: function () {
        mongoose.connect(url, options, function(error) {
            if(error) throw error;
            console.log('Connected to: ' + url);
        });
    }
}

 // enables to export datebase object when called in another .js file
 module.exports = database;