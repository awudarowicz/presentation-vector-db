
import OpenAI from "openai";
import fs from 'fs';
import path from 'path';
import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const dbClient = new QdrantClient({ host: '127.0.0.1', port: 6333 });

const COLLECTION_NAME = 'advanced';



// BODY
// await createDatabase();

// const question = 'Who was the boss?';
// const question = 'Kto stał na czele tej bandy?’;
// const question = 'Jak agreeman pokonywał roboty?';
// const question = 'Jak Parmezan pokonywał swoich wrogów?';
// const question = 'Gdzie konspirował Woda?';
// const question = 'Is there someone who never was on production?';
// const question = 'Who liked to play on instruments?';
// const question = 'Czy są jakieś straty wśród bohaterów?';
const question = 'Kto mógłby wyciąć dla drużyny serduszka z plexi?';


// const result = await getRawAnswer(question); // raw results from database
const result = await getAnswerWithLLM(question); // nice answer from LLM based on database results

console.log(result);



// HELPER FUNCTIONS
async function searchDatabase(question, limit = 1) {
    return await dbClient.search(COLLECTION_NAME, {
        vector: await getEmbeddingForString(question),
        limit,
    });
};

async function createDatabase() {
    await dbClient.createCollection(COLLECTION_NAME, { vectors: { size: 3072, distance: 'Cosine' } });


    const directoryPath = './data/advanced/heroes';
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const content = fs.readFileSync(path.join(directoryPath, file), 'utf8').trim();
        const hero = file.split('.')[0];

        await Promise.all(content.split('\n\n').map(async (chunk) => {
            const embedding = await getEmbeddingForString(chunk.trim());

            await dbClient.upsert(COLLECTION_NAME, {
                wait: true,
                points: [
                    {
                        id: uuidv4(),
                        vector: embedding,
                        payload: { content: chunk.trim(), hero: hero },
                    },
                ]
            })
        }));
    };
}


async function getEmbeddingForString(text) {
    const embeddingResponse = await openai.embeddings.create({
        input: text,
        model: "text-embedding-3-large",
    });

    return embeddingResponse.data[0].embedding;
};
async function getRawAnswer(question) {
    return await searchDatabase(question);
}

async function getAnswerWithLLM(question) {
    const dbResults = await searchDatabase(question, 5);
    console.log(dbResults);
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                You are assistant whose role is to answer user questions basing on the provided context.
                Return just the briefly answer and nothing else.
                Always return answer in Polish language.

                <context>
                ${dbResults.map((result) => result.payload.content).join('\n\n')}
                </context>
                `,
            },
            {
                role: "user",
                content: question,
            }
        ],
        model: "gpt-4o",
    });

    return response.choices[0].message.content;
}