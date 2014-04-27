exports.index = function(req, res) {
  return res.render('index', {
    loggedin: req.user
  });
};

exports.logout = function(req, res) {
  req.logout();
  return res.redirect('/');
};

exports.loginSuccess = function(req, res) {
  return res.redirect('/');
};

exports.loginFail = function(req, res) {
  return res.redirect('/');
};

exports.removeAccount = function(req, res) {
  var Users, mongoose;
  mongoose = require('mongoose');
  if (!req.user) {
    return res.redirect('/auth/facebook');
  } else {
    Users = mongoose.model('users');
    return Users.update({
      id: req.user
    }, {
      $set: {
        hidden: true
      }
    }, function() {
      return res.redirect('/logout');
    });
  }
};

exports.getUser = function(req, res) {
  var Users, mongoose;
  if (!req.params.id) {
    return res.jsonp({
      nope: 1
    });
  }
  mongoose = require('mongoose');
  Users = mongoose.model('users');
  return Users.findOne().where('id').equals(req.params.id).select('id name').exec(function(err, data) {
    return res.jsonp(data);
  });
};

exports.getLoggedUser = function(req, res) {
  var Users, mongoose;
  if (!req.user) {
    return res.jsonp({
      nope: 1
    });
  }
  mongoose = require('mongoose');
  Users = mongoose.model('users');
  return Users.findOne().where('id').equals(Number(req.user)).select('id name').exec(function(err, data) {
    return res.jsonp(data);
  });
};
