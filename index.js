let CouchDocumentSource = require('./couch-document-source');

function main() {
    let documentSource = new CouchDocumentSource();
    documentSource.forEach((doc) => {
        return Promise.resolve(console.log(doc.id));
    }).then( (docCount) => console.log("Done. Processed " + docCount + " documents."));
}

main();

