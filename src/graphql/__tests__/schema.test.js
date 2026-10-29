import { ApolloServer } from '@apollo/server';

import { typeDefs, resolvers } from '../schema.js';

describe('createSchema', () => {
  it('creates schema without errors', () => {
    const apolloServer = new ApolloServer({
      resolvers,
      typeDefs,
    });

    expect(apolloServer).toBeDefined();
  });
});
