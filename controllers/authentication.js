const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
};

exports.signin = function(req, res, next){
  //User has already had their email and password authorized
  //We just need to give them a token

  res.send({token: tokenForUser(req.user)});
};

exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({error: "You must provide email and password"})
  };

  // See if the user with the given email exists
  User.findOne({email: email}, function(err, existingUser){
    if(err){return next(err)};

    //if the user with email does exist return an error
    if(existingUser){
      return res.status(422).send({error: 'Email is in use'})
    };

    //if the user with email does not exist, create an save user record
    const user = new User({
      email, 
      password
    });

    user.save(function(err){
      if(err) {return next(err)}

      //Respond to request indicating the user was created
      res.json({token: tokenForUser(user)});
    });
  });
};