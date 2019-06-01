const path = require('path'),
  ExpressBrute = require('express-brute'),
  ExpressBruteMongooseStore = require('express-brute-mongoose'),
  mongoose = require('mongoose'),
  events = require(path.resolve('modules/application/services/events')),
  errorController = require(path.resolve('modules/application/controllers/errors'));

const BruteForce = mongoose.model('BruteForce');
const store = new ExpressBruteMongooseStore(BruteForce);
const config = require(path.resolve('./server/config'));

const failCallback = function (req, res, next, nextValidRequestDate) {
  //req.flash('error', "You've made too many failed attempts in a short period of time, please try again "+moment(nextValidRequestDate).fromNow());
  //res.redirect('/login'); // brute force protection triggered, send them back to the login page

  events.publish({
    action: 'api-requests-exceeded',
    type: 'index'
  }, req);

  res.status(400).sendMessage('api.too_many_requests');
};

const handleStoreError = (error) => {
  //log.error(error); // log this error so we can figure out what went wrong
  // cause node to exit, hopefully restarting the process fixes the problem
  errorController.logError(error);
};

const MAX_API_REQUESTS = config.maxBruteReq || 1000;

// No more than 1000 api requests attempts per hour per IP
exports.globalBruteforce = new ExpressBrute(store, {
  freeRetries: process.env.NODE_ENV === 'test' ? Infinity : MAX_API_REQUESTS,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 60*60, // 1 hour (seconds not milliseconds)
  failCallback: failCallback,
  handleStoreError: handleStoreError
});

exports.preventByKey = (key) => {
  return (req, res, next) => {
    if(req[key] && req[key]._id) {
      return exports.globalBruteforce.getMiddleware({key: req[events.REAL_IP_HEADER] + req[key]._id})(req, res, next);
    }
    return exports.globalBruteforce.getMiddleware({key: req[events.REAL_IP_HEADER]})(req, res, next);
  };
};

/*
app.post('/auth',
  globalBruteforce.prevent,
  userBruteforce.getMiddleware({
    key: function(req, res, next) {
      // prevent too many attempts for the same username
      next(req.body.username);
    }
  }),
  function (req, res, next) {
    if (User.isValidLogin(req.body.username, req.body.password)) { // omitted for the sake of conciseness
      // reset the failure counter so next time they log in they get 5 tries again before the delays kick in
      req.brute.reset(function () {
        res.redirect('/'); // logged in, send them to the home page
      });
    } else {
      res.flash('error', "Invalid username or password")
      res.redirect('/login'); // bad username/password, send them back to the login page
    }
  }
);*/
