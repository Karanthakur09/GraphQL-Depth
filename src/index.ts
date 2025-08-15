import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());
    //create graphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
                hello:String
                say(name:String): String
            }
        `, //schemas
        resolvers: {
            Query: {
                hello: () => 'Hello from GraphQL server',
                say: (_, { name }: { name: String }) => `Hey ${name}`
            }
        } //actual function or logic
    })
    //start server
    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({
            message: 'Welcome to the server!'
        })
    })

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`);
    })
}

init();