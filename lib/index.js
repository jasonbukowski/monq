var Connection = require('./connection');

module.exports = function (uri, options, collectionParameters) {
    return new Connection(uri, options, collectionParameters);
};