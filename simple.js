
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const dbClient = new QdrantClient({ host: '127.0.0.1', port: 6333 });
const COLLECTION_NAME = 'simple';

const data = [
    'IKEA (sklep, meble)',
    'Pizza Hut (restauracja)',
    'KFC (restauracja)',
    'Apple (elektronika użytkowa)',
    'Tesla (samochody elektryczne)',
    'Microsoft (oprogramowanie)',
    'Hyland (zarządzanie treścią)'
]

// BODY
// await createDatabase(data);

// const question = 'restauracja';
// const question = 'jedzenie';
// const question = 'food';
// const question = 'komoda';
// const question = 'macbook';
// const question = 'dokument';
const question = 'company with cars?';


const result = await searchDatabase(question);
console.log(result);








// HELPER FUNCTIONS
async function searchDatabase(question, limit = 1) {
    return await dbClient.search(COLLECTION_NAME, {
        vector: await getEmbeddingForString(question),
        limit,
    });
};

async function createDatabase(data) {
    await dbClient.createCollection(COLLECTION_NAME, { vectors: { size: 3072, distance: 'Cosine' } });

    await Promise.all(data.map(async (row) => {
        const embedding = await getEmbeddingForString(row.trim());

        await dbClient.upsert(COLLECTION_NAME, {
            wait: true,
            points: [
                {
                    id: uuidv4(),
                    vector: embedding,
                    payload: { content: row.trim() },
                },
            ]
        })
    }));
}


async function getEmbeddingForString(text) {
    const embeddingResponse = await openai.embeddings.create({
        input: text,
        model: "text-embedding-3-large",
    });

    return embeddingResponse.data[0].embedding;
};