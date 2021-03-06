var FacebookStrategy, MongoStore, app, express, http, io, mongoStore, mongoconfig, mongoose, onlineList, passport, path, routes, sendOfflineNotice, server, setUserOffline, setUserOfflineTimeout, setUserOnline, settings, timeouts, _;

express = require("express");

http = require("http");

path = require("path");

routes = require("./routes");

passport = require("passport");

FacebookStrategy = require("passport-facebook").Strategy;

mongoose = require('mongoose');

_ = require('lodash');

MongoStore = require('connect-mongo')(express);

settings = require('./configuration.json');

mongoconfig = require("./utils/mongoconfig")(settings);

app = express();

server = http.createServer(app);

mongoStore = new MongoStore({
  db: settings.db
});

io = require('socket.io').listen(server);

app.configure(function() {
  app.set('port', process.env.PORT || settings.port);
  app.set('views', "" + __dirname + "/views");
  app.set('view engine', 'ejs');
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.favicon('public/favicon.ico'));
  app.use(express.methodOverride());
  app.use(express.cookieParser(settings.cookie));
  app.use(express.session({
    secret: settings.cookie,
    cookie: {
      maxAge: 60000 * 60 * 24 * 30 * 12
    },
    store: mongoStore
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express["static"](path.join(__dirname, "public")));
  return app.use(app.router);
});

app.get("/", routes.index);

app.get("/logout", routes.logout);

app.get("/settings/delete/account", routes.removeAccount);

app.get("/login/success", routes.loginSuccess);

app.get("/login/fail", routes.loginFail);

app.get("/api/profile/:id", routes.getUser);

app.get("/api/loggedin", routes.getLoggedUser);

app.get("/auth/facebook", passport.authenticate("facebook", {
  scope: ['email', 'user_birthday']
}));

app.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/login/success",
  failureRedirect: "/login/fail"
}));

app.get('/:foo*', routes.index);

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var Users;
  Users = mongoose.model('users');
  return Users.findOne({
    id: id
  }).exec(function(err, user) {
    if (err) {
      return done(err);
    } else {
      return done(null, user.id);
    }
  });
});

passport.use(new FacebookStrategy(settings.facebook, function(accessToken, refreshToken, profile, done) {
  var Locations, Privacy, Users;
  Users = mongoose.model('users');
  Locations = mongoose.model('locations');
  Privacy = mongoose.model('privacy');
  return Users.findOne({
    id: profile.id
  }).exec(function(err, data) {
    var location, privacy, user, _ref, _ref1, _ref2, _ref3;
    if (err) {
      return done(err);
    } else if (data) {
      done(null, data);
      Users.update({
        id: data.id
      }, {
        $set: {
          hidden: true
        }
      });
      return Privacy.findOne({
        id: data.id
      }).exec(function(err, privacyData) {
        var privacy;
        if (!privacyData) {
          privacy = new Privacy({
            id: data.id
          });
          return privacy.save(function() {});
        }
      });
    } else {
      location = {
        name: (_ref = profile._json.location) != null ? _ref.name : void 0,
        id: Number((_ref1 = profile._json.location) != null ? _ref1.id : void 0)
      };
      Locations.findOne({
        id: location.id
      }).exec(function(err, data) {
        var locations;
        if (!data) {
          locations = new Locations(location);
          return locations.save(function() {});
        }
      });
      privacy = new Privacy({
        id: profile.id
      });
      privacy.save(function() {});
      user = new Users({
        id: profile.id,
        name: profile.displayName,
        username: profile.username,
        url: profile.profileUrl,
        gender: profile.gender,
        location: location.name,
        education: (_ref2 = profile._json.education) != null ? _ref2[0].school.name : void 0,
        quotes: profile._json.quotes,
        bio: profile._json.bio,
        occupation: (_ref3 = profile._json.work) != null ? _ref3[0].position.name : void 0,
        email: profile._json.email,
        birthday: profile._json.birthday
      });
      return user.save(function(err) {
        if (err) {
          return done(err);
        } else {
          return done(null, user);
        }
      });
    }
  });
}));

onlineList = [];

timeouts = {};

setUserOffline = function(socket, id) {
  _.remove(onlineList, function(online) {
    return online.id === id;
  });
  return sendOfflineNotice(socket, id);
};

sendOfflineNotice = function(socket, id) {
  socket.emit('offline', id);
  return socket.broadcast.emit('offline', id);
};

setUserOnline = function(socket, data) {
  var userOnline;
  userOnline = _.find(onlineList, function(online) {
    return online.id === data.id;
  });
  if (!userOnline) {
    onlineList.push(data);
    socket.emit('online', data);
    socket.broadcast.emit('online', data);
    return setUserOfflineTimeout(socket, data.id);
  }
};

setUserOfflineTimeout = function(socket, id) {
  if (timeouts[id]) {
    clearTimeout(timeouts[id]);
  }
  return timeouts[id] = setTimeout(function() {
    setUserOffline(socket, id);
    return delete timeouts[id];
  }, 300000);
};

io.sockets.on('connection', function(socket) {
  socket.on('load-chat-history', function() {
    return socket.emit('chat-history', onlineList);
  });
  socket.on('load-online-list', function(data) {
    return socket.emit('online-list', data);
  });
  socket.on('message', function(data) {
    data.date = new Date();
    socket.emit('message', data);
    socket.broadcast.emit('message', data);
    setUserOnline(socket, data.from);
    return setUserOfflineTimeout(socket, data.from.id);
  });
  socket.on('online', function(data) {
    return setUserOnline(socket, data);
  });
  return socket.on('offline', function(data) {
    return setUserOffline(socket, data.id);
  });
});

/*
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
*/


server.listen(app.get("port"), function() {
  return console.log("Express server listening on port " + app.get("port"));
});
