let env = require('./env');

class CouchDocumentSource {
    constructor() {
        let nano = require('nano')('http://' + env.COUCHDB_SERVER + ':' + env.COUCHDB_PORT);

        this.docIds = null;
        this.nextIdx = 0;
        this.sourceDb = nano.use(env.COUCHDB_DB);
        this.verbose = false;
    }

    log(message) {
        if (this.verbose) {
            console.info(message);
        }
    }
    forEach(callback) {
        return new Promise((resolve, reject) => {
            if (!this.docIds) {
                this.getAllDocumentIds().then((results) => {
                    this.docIds = results;
                    this.forEach(callback).then( (docCount) => resolve(docCount));
                });
            }
            else {
                let reduceResult = this.docIds.reduce((p, nextDocId) => {
                    return p.then((document) => {
                        if (!document) {
                            this.log("no document, skipping (first call)");
                            return this.getDocument(nextDocId);

                        }
                        if (document) {
                            // call the provided callback with the document, if the callback
                            // returns a promise, wait for it, then return our promise to
                            // get the next document.
                            let callbackResult = callback(document);
                            return Promise.resolve(callbackResult).then( () =>  this.getDocument(nextDocId));
                        }
                    });
                }, Promise.resolve()).then( () => resolve(this.docIds.length));
            }
        });

    }

    getAllDocumentIds() {
        return new Promise((resolve, reject) => {
            this.log("Loading document ids...");
            this.sourceDb.list((err, body) => {
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

    getDocument(documentId) {
        return new Promise((resolve, reject) => {
            this.log("loading " + documentId);
            this.sourceDb.get(documentId, (err, doc) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(doc);
                }
            });
        });
    }

    // next() {
    //     return new Promise((resolve, reject) => {
    //         if (this.isDone()) {
    //             resolve({ done: true });
    //         }
    //         else {
    //             this.nextValue().then((doc) => {
    //                 resolve({ done: false, value: doc });
    //             });
    //         }
    //     });
    // }

    // isDone() {
    //     if (this.docIds === null) {
    //         return false;
    //     }
    //     return (this.nextIdx < this.docIds.length);
    // }

    // nextValue() {
    //     return new Promise((resolve, reject) => {
    //         if (this.docIds) {
    //             this.nextDocument(resolve, reject);
    //         }
    //         else {
    //             this.getAllDocumentIds().then((results) => {
    //                 this.docIds = results;
    //                 this.nextDocument(resolve, reject);
    //             });
    //         }
    //     });
    // }

    // nextDocument(resolve, reject) {
    //     if (this.nextIdx < this.docIds.length) {
    //         let docId = this.docIds[this.nextIdx++];
    //         this.getDocument(docId).then((doc) => {
    //             resolve(doc);
    //         });
    //     }
    //     else {
    //         reject(false);
    //     }
    // }

}

module.exports = CouchDocumentSource;
