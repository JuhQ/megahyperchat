express = require("express")
http = require("http")
path = require("path")
routes = require("./routes")
passport = require("passport")
FacebookStrategy = require("passport-facebook").Strategy
mongoose = require('mongoose')
_ = require('lodash')
MongoStore = require('connect-mongo')(express)

settings = require('./configuration.json')
mongoconfig = require("./utils/mongoconfig")(settings)


app = express()
server = http.createServer(app)
mongoStore = new MongoStore db: settings.db

io = require('socket.io').listen(server)


app.configure ->
  app.set 'port', process.env.PORT or settings.port
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'ejs'
  app.use express.urlencoded()
  app.use express.json()
  app.use express.favicon('public/favicon.ico')
  app.use express.methodOverride()
  app.use express.cookieParser(settings.cookie)

  app.use express.session
    secret: settings.cookie
    cookie: {maxAge: 60000 * 60 * 24 * 30 * 12} # one year
    store: mongoStore
  
  app.use passport.initialize()
  app.use passport.session()

  app.use express.static(path.join(__dirname, "public"))
  app.use app.router

app.get "/", routes.index
app.get "/logout", routes.logout
app.get "/settings/delete/account", routes.removeAccount

app.get "/login/success", routes.loginSuccess
app.get "/login/fail", routes.loginFail


# Redirect the user to Facebook for authentication.  When complete,
# Facebook will redirect the user back to the application at
#     /auth/facebook/callback
app.get "/auth/facebook", passport.authenticate("facebook", { scope: ['email', 'user_birthday'] })


# Facebook will redirect the user to this URL after approval.  Finish the
# authentication process by attempting to obtain an access token.  If
# access was granted, the user will be logged in.  Otherwise,
# authentication has failed.
app.get "/auth/facebook/callback", passport.authenticate("facebook",
  successRedirect: "/login/success"
  failureRedirect: "/login/fail"
)


passport.serializeUser (user, done) ->
  done null, user.id

passport.deserializeUser (id, done) ->
  Users = mongoose.model 'users'
  Users.findOne({
    id
  }).exec (err, user) ->
    if err
      done err
    else
      done null, user.id


passport.use new FacebookStrategy settings.facebook, (accessToken, refreshToken, profile, done) ->
  Users = mongoose.model 'users'

  Locations = mongoose.model 'locations'
  Privacy = mongoose.model 'privacy'
  Users
    .findOne({
      id: profile.id
    })
    .exec (err, data) ->
      if err
        done(err)
      else if data
        done null, data

        Users
          .update { id: data.id }, $set: hidden: true

        Privacy
          .findOne({
            id: data.id
          })
          .exec (err, privacyData) ->
            if !privacyData
              privacy = new Privacy(id: data.id)
              privacy.save ->

      else
        location =
          name: profile._json.location?.name
          id: Number profile._json.location?.id

        Locations.findOne({
          id: location.id
        }).exec (err, data) ->
          if !data
            locations = new Locations(location)
            locations.save ->

        privacy = new Privacy(id: profile.id)
        privacy.save ->

        user = new Users
          id: profile.id
          name: profile.displayName
          username: profile.username
          url: profile.profileUrl
          gender: profile.gender
          location: location.name
          education: profile._json.education?[0].school.name
          quotes: profile._json.quotes
          bio: profile._json.bio
          occupation: profile._json.work?[0].position.name
          email: profile._json.email
          birthday: profile._json.birthday

        user.save (err) ->
          if err
            done(err)
          else
            done null, user



onlineList = []
timeouts = {}

setUserOffline = (socket, id) ->
  _.remove onlineList, (online) ->
    online.id is id

  sendOfflineNotice socket, id

sendOfflineNotice = (socket, id) ->
  socket.emit 'offline', id
  socket.broadcast.emit 'offline', id


setUserOnline = (socket, data) ->
  onlineList.push data
  socket.emit 'online', data
  socket.broadcast.emit 'online', data


io.sockets.on 'connection', (socket) ->

  socket.on 'load-chat-history', ->
    socket.emit 'chat-history', onlineList

  socket.on 'load-online-list', (data) ->
    socket.emit 'online-list', data

  socket.on 'message', (data) ->
    data.date = new Date()
    socket.emit 'message', data
    socket.broadcast.emit 'message', data

    if timeouts[data.from.id]
      clearTimeout timeouts[data.from.id]

    timeouts[data.from.id] = setTimeout ->
      setUserOffline socket, data.from.id

      delete timeouts[data.from.id]

    , 300000 # five minutes

    userOnline = _.find onlineList, (online) ->
      online.id is data.from.id

    if !userOnline
      setUserOnline socket, data.from


  socket.on 'online', (data) ->
    setUserOnline socket, data

  socket.on 'offline', (data) ->
    setUserOffline socket, data.id



###
cluster = require("cluster")
numCPUs = require("os").cpus().length
if cluster.isMaster
  
  # Fork workers.
  i = 0
  while i < numCPUs
    cluster.fork()
    i++

  # Revive dead worker
  cluster.on "exit", (worker, code, signal) ->
    console.log "worker " + worker.process.pid + " died"
    cluster.fork()

else
###
server.listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")