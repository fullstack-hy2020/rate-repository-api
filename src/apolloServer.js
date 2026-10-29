import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import { ValidationError } from 'yup';

import AuthService from './utils/authService.js';
import createDataLoaders from './utils/createDataLoaders.js';
import logger from './utils/logger.js';
import { resolvers, typeDefs } from './graphql/schema.js';

const apolloErrorFormatter = (formattedError, error) => {
  logger.error(error);

  const { originalError } = error;
  const isGraphQLError = !(originalError instanceof Error);

  if (originalError instanceof ValidationError) {
    const badUserInputError = {
      ...formattedError,
      extensions: { ...formattedError.extensions, code: 'BAD_USER_INPUT' },
    };

    return badUserInputError;
  }

  if (originalError instanceof GraphQLError || isGraphQLError) {
    return formattedError;
  }

  const internalServerError = {
    message: 'Something went wrong',
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  };

  return internalServerError;
};

const createContext = async ({ req }) => {
  const authorization = req.headers.authorization;

  const accessToken = authorization
    ? authorization.split(' ')[1]
    : undefined;
  const dataLoaders = createDataLoaders();

  const context = {
    authService: new AuthService({
      accessToken,
      dataLoaders,
    }),
    dataLoaders,
  };

  return context;
};

const startApolloServer = async ({ port }) => {
  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    csrfPrevention: false,
    formatError: apolloErrorFormatter,
  });

  await startStandaloneServer(apolloServer, {
    listen: { port },
    context: createContext,
  });
};

export default startApolloServer;
