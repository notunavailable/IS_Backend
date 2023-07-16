const { PineconeClient } = require("@pinecone-database/pinecone");

const connectPC = async () => {
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENV,
      apiKey: process.env.PINECONE_API_KEY,
    });
    return pinecone;
}

module.exports = connectPC;