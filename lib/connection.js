var mongo = require('mongojs');
var job = require('./job');
var Queue = require('./queue');
var Worker = require('./worker');

module.exports = Connection;

function Connection(uri, options, collectionParameters) {
    this.db = mongo(uri, [], options);
    this.collectionParameters = (collectionParameters || {});
}

Connection.prototype.worker = function (queues, options) {
    var self = this;

    if (queues === "*") {
        var opts = {universal: true, collection: this.collectionParameters.name || 'jobs' };
        options.universal = true;
        queues = [new Queue('*', opts, this.collectionName)];
    } else {
        if (!Array.isArray(queues)) {
            queues = [queues];
        }

        var queues = queues.map(function (queue) {
            if (typeof queue === 'string') {
                queue = self.queue(queue);
            }

            return queue;
        });
    }
    return new Worker(queues, options);
};

Connection.prototype.queue = function (name, options) {
    return new Queue(this, name, options, this.collectionParameters.name || 'jobs');
};

Connection.prototype.close = function () {
    this.db.close();
};
