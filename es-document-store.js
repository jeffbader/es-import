let env = require('./env');
let elasticsearch = require('elasticsearch');

class ElasticsearchDocumentStore {
    constructor() {
        this.verbose = true;
        this.esClient = new elasticsearch.Client({
            host: env.ES_SERVER + ':' + env.ES_PORT,
            log: 'trace'
        });
    }

    log(message) {
        if (this.verbose) {
            console.info(message);
        }
    }
    index(document, docType) {
        // return the promise
        return this.esClient.index({
            index: env.ES_INDEX,
            type: docType,
            id: document.id,
            body: document
        });
    }
}

module.exports = ElasticsearchDocumentStore;