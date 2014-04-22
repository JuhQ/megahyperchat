module.exports = function(settings) {
  var locationSchema, messageSchema, mongoose, privacySchema, userSchema, votesSchema;
  mongoose = require('mongoose');
  userSchema = mongoose.Schema({
    id: 'Number',
    name: 'String',
    username: {
      type: String,
      lowercase: true,
      trim: true
    },
    url: 'String',
    gender: 'String',
    location: 'String',
    occupation: 'String',
    education: 'String',
    email: 'String',
    quotes: 'String',
    bio: 'String',
    birthday: 'Date',
    created: {
      type: Date,
      "default": Date.now
    },
    hidden: {
      type: Boolean,
      "default": false
    },
    random: {
      type: [Number],
      index: '2d',
      "default": function() {
        return [Math.random(), Math.random()];
      }
    }
  });
  locationSchema = mongoose.Schema({
    id: 'Number',
    name: 'String',
    created: {
      type: Date,
      "default": Date.now
    }
  });
  votesSchema = mongoose.Schema({
    id: 'Number',
    voterid: 'Number',
    vote: 'String',
    location: 'Number',
    created: {
      type: Date,
      "default": Date.now
    }
  });
  privacySchema = mongoose.Schema({
    id: 'Number',
    name: {
      type: Boolean,
      "default": true
    },
    location: {
      type: Boolean,
      "default": true
    },
    occupation: {
      type: Boolean,
      "default": true
    },
    birthday: {
      type: Boolean,
      "default": true
    }
  });
  messageSchema = mongoose.Schema({
    chatid: 'Number',
    message: 'String',
    sender: 'Number',
    "private": {
      type: Boolean,
      "default": false
    },
    created: {
      type: Date,
      "default": Date.now
    }
  });
  mongoose.model('users', userSchema);
  mongoose.model('locations', locationSchema);
  mongoose.model('votes', votesSchema);
  mongoose.model('privacy', privacySchema);
  mongoose.model('messages', messageSchema);
  return mongoose.connect('localhost', settings.db);
};
