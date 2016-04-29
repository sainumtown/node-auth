var express = require('express');
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

/* GET register page. */
router.get('/login', function(req, res, next) {
  console.log('test');
  res.render('login', { title: 'Login' });
});

/* post register page */
router.post('/register',function(req, res,next){
  // Get from values
  var name = req.body.name;
  var email = req.body.email;
  var userName = req.body.userName;
  var password = req.body.password;
  var password2 = req.body.password2;


  // check for image field.
  if(req.files.profileImage){
    console.log('Uploading file....');

    // File info
    var profileImageOriginalName = req.files.profileImage.originalname;
    var profileImageName         = req.files.profileImage.name;
    var profileImageMime        = req.files.profileImage.mimetype;
    var profileImageExt         = req.files.profileImage.extension;
    var profileImagePath         = req.files.profileImage.path;
    var profileImageSize         = req.files.profileImage.size;
  } else{
    // set default image
    var  profileImageName = 'noimage.png';
  }

  // Form validation
  req.checkBody('name',"Name field is required").notEmpty();
  req.checkBody('email',"Email field is required").notEmpty();
  req.checkBody('userName',"User Name field is required").notEmpty();
  req.checkBody('password',"Password field is required").notEmpty();
  req.checkBody('password2',"Password not match").notEmpty();

  // check for errors
  var errors = req.validationErrors();
  if(errors){
    res.render('register',{
      errors: errors,
      name: name,
      email: email,
      userName: userName,
      password: password,
      passwrod2: password2
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      userName: userName,
      password: password,
      profileImage: profileImageName
    });

    // create user
    User.createUser(newUser,function(err,user){
      if(err) throw err;
        console.log(user);
    });
    // Success message
    req.flash('success','You are now registered and may log in.');

    res.location('/');
    res.redirect('/');
  }
});

passport.use(new LocalStrategy(
  function(username, password, done){
      console.log('Unknown usersss');

    User.getUserByUserName(username,function(err,user){
      console.log('Unknown userd');
      if(err) throw err;
      if(!user){
        console.log('Unknown user');
        return done(null,false,{message:'Unknow user'});
      }
      console.log('Unknown user'+user);
      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        }else{
          console.log('Invalid password');
          return done(null,false,{message:'Invalid Password'});
        }
      });
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req,res){
  console.log('Authentication Successful');
  req.flash('success', 'You are log in successful');
  res.redirect('/');
});

router.get('/logout',function(req,res){
  req.logout();
  req.flash('success','You are log out.')
  res.redirect('/users/login');
});

module.exports = router;
