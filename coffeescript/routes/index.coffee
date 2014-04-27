exports.index = (req, res) ->
  res.render 'index',
    loggedin: req.user

exports.logout = (req, res) ->
  req.logout()
  res.redirect('/')

exports.loginSuccess = (req, res) ->
  res.redirect('/')

exports.loginFail = (req, res) ->
  res.redirect('/')

exports.removeAccount = (req, res) ->
  mongoose = require('mongoose')
  if !req.user
    res.redirect('/auth/facebook')
  else
    Users = mongoose.model 'users'
    Users
      .update { id: req.user },
        $set:
          hidden: true
        , ->
          res.redirect('/logout')


exports.getUser = (req, res) ->
  if !req.params.id
    return res.jsonp {nope: 1}

  mongoose = require('mongoose')
  Users = mongoose.model 'users'
  Users
    .findOne()
    .where('id')
    .equals(req.params.id)
    .select('id name')
    .exec (err, data) ->
      res.jsonp data

exports.getLoggedUser = (req, res) ->
  if !req.user
    return res.jsonp {nope: 1}

  mongoose = require('mongoose')
  Users = mongoose.model 'users'
  Users
    .findOne()
    .where('id')
    .equals(Number(req.user))
    .select('id name')
    .exec (err, data) ->
      res.jsonp data