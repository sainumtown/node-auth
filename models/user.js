var mongoose = require('mongoose');
var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/nodeauth';
mongoose.connect(uristring);
var db = mongoose.connection;

// User schema
var UserSchema = mongoose.Schema({
  userName: {
    type: String,
    index: true
  },
  password:{
    type: String
  },
  email:{
    type: String
  },
  name:{
    type: String
  },
  profileImage:{
    type:String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);


module.exports.comparePassword = function(candidatePassword,password,callback){
  var isMatch = false;
  if(candidatePassword === password){
    isMatch = true;
  }
    callback(null,isMatch);
}

module.exports.getUserByUserName = function(username,callback){
  var query = {userName : username};
  User.findOne(query,callback);
}

module.exports.getUserById = function(id,callback){

  User.findById(id,callback);
}

module.exports.createUser = function(newUser, callback){
  newUser.save(callback);
}
