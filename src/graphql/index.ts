import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { BuildSchemaOptions, buildSchema } from 'type-graphql';
import { Container } from 'typedi';

const apolloServer = async () => {
    const resolvers = path.join(__dirname, './**/index.{ts,js}');
    const apolloSchemaOptions: BuildSchemaOptions = {
        resolvers: [resolvers],
        validate: false,
        container: Container,
    };
    const apolloSchema = await buildSchema(apolloSchemaOptions);

    return new ApolloServer({
        schema: apolloSchema,
        playground: true,
        introspection: true,
        context: (context: any) => {
            return context
        },
    });
};

export default apolloServer;