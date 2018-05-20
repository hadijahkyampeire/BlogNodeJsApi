var mongoose = require('mongoose');

// users schema
var userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

// Export so that it is accessible from anywhere
var User = module.exports = mongoose.model('User', userSchema)

// Register user
module.exports.registerUser = function(user, callback){
    User.create(user, callback);
}