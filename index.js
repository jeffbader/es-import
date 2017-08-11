let CouchDocumentSource = require('./couch-document-source');
let ESDocumentStore = require ('./es-document-store');

function main() {
    let documentSource = new CouchDocumentSource();
    let esDocumentStore = new ESDocumentStore();
    let forEachPromise = documentSource.forEach((doc) => {
        return new Promise( (resolve, reject) => {
            // remove CouchDB properties.
            delete doc._id;
            delete doc._rev;
            delete doc.version;
            delete doc.lastModified;  // for now, until we have better mapping
            console.log(doc.id);
            resolve( esDocumentStore.index(doc, 'recording') );
        });
    });
    
    forEachPromise.then( (docCount) => console.log("Done. Processed " + docCount + " documents."));
}

main();

