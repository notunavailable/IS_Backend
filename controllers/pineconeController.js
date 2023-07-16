const { PineconeClient } = require("@pinecone-database/pinecone");
const connectPC = require('../pc')


const createIndex = async (name) => {
    const pinecone = await connectPC()
    const index = await pinecone.createIndex({
        createRequest: {
            name: name,
            dimension: 1024,
        },
    });
    return index;
};

const listIndex = async () => {
    const pinecone = await connectPC()
    const indexesList = await pinecone.listIndexes();
    return indexesList;
};

const deleteIndex = async (name) => {
    const pinecone = await connectPC()
    const index = await pinecone.deleteIndex({
        indexName: name,
    });
    return index;
};

const upsert = async ({pIndex, values, id, metadata}) => {
    try {
        const pinecone = await connectPC()
        const index = pinecone.Index(pIndex);
        const upsertRequest = {
            vectors: [
                {
                    id: id,
                    values: values,
                    metadata: metadata
                }
            ]
        };
        console.log(upsertRequest.vectors[0])
        const upsertResponse = await index.upsert({ upsertRequest });
        return upsertResponse;
    } catch (err) {
        console.error("Error while performing upsert operation:", err);
        throw err;
    }
};

const query = async ({pIndex, values}) => {
    try {
        const pinecone = await connectPC()
        const index = pinecone.Index(pIndex);
        const queryRequest = {
            vector: values,
            topK: 5,
            includeValues: true,
            includeMetadata: true,
            filter: {
              difficulty: { $in: ["common", "uncommon"] },
            },
        };
        const queryResponse = await index.query({ queryRequest });
        return queryResponse;
    } catch (err) {
        console.error("Error while performing query operation:", err);
        throw err;
    }
};

const remove = async ({pIndex, id}) => {
    try {
        const pinecone = await connectPC()
        const index = pinecone.Index(pIndex);
        const queryResponse = await index.delete1({
            ids: [`${id}`],
          });
        return queryResponse;
    } catch (err) {
        console.error("Error while performing delete operation:", err);
        throw err;
    }
}

module.exports = { createIndex, listIndex, deleteIndex, upsert, query, remove };