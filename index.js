let env = require('./env');

function getDocument(documentId) {
    let nano = require('nano')('http://' + env.COUCHDB_SERVER + ':' + env.COUCHDB_PORT);
    let sourceDb = nano.use(env.COUCHDB_DB);

    return new Promise((resolve, reject) => {
        console.log("loading " + documentId);
        sourceDb.get(documentId, (err, doc) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(doc);
            }
        });
    });
}

function getAllDocumentIds() {
    let nano = require('nano')('http://' + env.COUCHDB_SERVER + ':' + env.COUCHDB_PORT);
    let sourceDb = nano.use(env.COUCHDB_DB);
    return promise = new Promise((resolve, reject) => {
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
}

function process_document_ids(docIds) {
    return docIds.reduce(function(p, docId) {
        return p.then(function(priorResult) {
            return getDocument(docId);
        });
    }, Promise.resolve());
}

function main() {

    // getDocument('00007290-7630-4cff-8b27-27c555276bbb').then((doc) => {
    //     console.log('retrieved document!');
    //     console.log(JSON.stringify(doc));
    // });

    getAllDocumentIds().then((docIds) => {
        console.log("found " + docIds.length + " documents...");
        process_document_ids(docIds).then( (finalResult) => {
          console.log("done");
        });
        // docIds.forEach((docId) => {
        //     console.log(docId);
        //     // getDocument(docId).then((doc) => {
        //     //     console.log(docId);
        //     // });
        // });
    });

}

main();

