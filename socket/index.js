var log = require('lib/log')(module);
var config = require('config');
var async = require('async');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var sessionStore = require('lib/sessionStore');
var HttpError = require('error').HttpError;
var User = require('models/user').User;

function loadSession(sid, callback) {
  sessionStore.load(sid, function(err, session) {
    if (arguments.length == 0) {
      return callback(null, null);
    } else {
      return callback(null, session);
    }
  });

}

function loadUser(session, callback) {
  if (!session.user) {
    log.debug("Session %s is anonymous", session.id);
    return callback(null, null);
  }

  log.debug("retrieving user ", session.user);

  User.findById(session.user, function(err, user) {
    if (err) return callback(err);

    if (!user) {
      return callback(null, null);
    }
    log.debug("user findbyId result: " + user);
    callback(null, user);
  });

}

module.exports = function(server) {
  var io = require('socket.io')(server);
  // io.set('origins', 'localhost:*');
  // io.set('logger', log);

  io.use(function(socket, next) {
    var handshakeData = socket.request;

    async.waterfall([
      function(callback) {
        handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
        var sidCookie = handshakeData.cookies[config.get('session:key')];
        var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

        loadSession(sid, callback);
      },
      function(session, callback) {

        if (!session) {
          callback(new HttpError(401, "No session"));
        }

        handshakeData.session = session;
        loadUser(session, callback);
      },
      function(user, callback) {
        if (!user) {
          callback(new HttpError(403, "Anonymous session may not connect"));
        }
        socket.handshake.user = user;
        next();
      }

    ], function(err) {
      if (!err) {
        return callback(null, true);
      }

      if (err instanceof HttpError) {
        return callback(null, false);
      }

      callback(err);
    });


  });

  io.sockets.on('session:reload', function(sid) {
    var clients = io.sockets.clients();
    console.log({clients})

    clients.forEach(function(client) {
      if (client.handshake.session.id != sid) return;

      loadSession(sid, function(err, session) {
        if (err) {
          client.emit("error", "server error");
          client.disconnect();
          return;
        }

        if (!session) {
          client.emit("logout");
          client.disconnect();
          return;
        }

        client.handshake.session = session;
      });
        
    });

  });


  io.on('connection', socket => {
    const {username} = socket.handshake.user;

    socket.broadcast.emit('join', username);

    socket.on('message', function(text, cb) {
      socket.broadcast.emit('message', username, text);
      cb && cb();
    });

    socket.on('disconnect', function() {
      socket.broadcast.emit('leave', username);
    });

  });

  return io;
};