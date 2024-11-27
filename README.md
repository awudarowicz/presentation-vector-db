# presentation-vector-db
Repo with examples to vector databases presentation

# Running examples

1. Create .env file (from .env.template) and put there your OpenAI api key
2. run `npm install`
3. run example with `node --env-file=.env advanced.js` and `node --env-file=.env simple.js` (uncomment the `await createDatabase();` line on first run to create the collection)


# Links related to presentation
- What are vector databases?: https://qdrant.tech/documentation/overview/#what-are-vector-databases
- Contextual retrieval in RAG: https://www.anthropic.com/news/contextual-retrieval
- RAG Techniques: https://pub.towardsai.net/advanced-rag-techniques-an-illustrated-overview-04d193d8fec6
- Advanced rag (pinecone): https://www.pinecone.io/learn/advanced-rag-techniques/
- Advanced RAG (llamaindex): https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-803a9d94c41b
- Advanced RAG patterns (Amazon): https://aws.amazon.com/blogs/machine-learning/advanced-rag-patterns-on-amazon-sagemaker/
- Semantic router: https://github.com/aurelio-labs/semantic-router
- Tokenizer : https://platform.openai.com/tokenizer
- Vector Databases comparison: https://benchmark.vectorview.ai/vectordbs.html
- Qdrant installation: https://qdrant.tech/documentation/quickstart/
