let env = require('./env');
let Promise = require('promise');

function getDocument(documentId) {
    let nano = require('nano')('http://' + env.COUCHDB_SERVER + ':' + env.COUCHDB_PORT);
    let sourceDb = nano.use(env.COUCHDB_DB);

    let promise = new Promise((resolve, reject) => {
        sourceDb.get(documentId, (err, doc) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(doc);
            }
        });
    });
    return promise;
}

function getAllDocumentIds() {
    let nano = require('nano')('http://' + env.COUCHDB_SERVER + ':' + env.COUCHDB_PORT);
    let sourceDb = nano.use(env.COUCHDB_DB);
    let promise = new Promise((resolve, reject) => {
        sourceDb.list((err, body) => {
            if (err) {
                reject(err);
            }
            else {
                let docIds = body.rows.map((row) => row.id);
                resolve(docIds);
            }
        });
    });
    return promise;
}

function main() {

    getDocument('00007290-7630-4cff-8b27-27c555276bbb').then((doc) => {
        console.log('retrieved document!');
        console.log(JSON.stringify(doc));
    });

    getAllDocumentIds().then((docIds) => {
        docIds.forEach((docId) => {
            console.log(docId);
            // getDocument(docId).then((doc) => {
            //     console.log(docId);
            // });
        });
    });

}

main();

