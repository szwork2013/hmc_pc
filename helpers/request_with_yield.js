let _request = require('request');

function request(options) {
  return function thunk(cb) {
    _request(options, cb);
  };
}

module.exports = request;
