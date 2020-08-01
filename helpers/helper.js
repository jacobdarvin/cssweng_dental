const sanitize = require('mongo-sanitize');

const helper = {

    sanitize: function (query) {
        return sanitize(query);
      },
}

module.exports = helper;