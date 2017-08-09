var env = require('./env');
var couchdb = require('nano');

var nano = require('nano')('http://' + env.COUCHDB_SERVER + ':' + env.COUCHDB_PORT);
var sourceDb = nano.use(env.COUCHDB_DB);

// get a single document from couch DB
sourceDb.get('00007290-7630-4cff-8b27-27c555276bbb', function (err, body) {
    console.log('retrieved document!');
    console.log(JSON.stringify(body));
});

// get all the document ids
sourceDb.list(function (err, body) {
    if (err) {
        console.error(err);
    }
    else {
        body.rows.forEach(function (doc) {
            console.log(doc);
        });
    }
});