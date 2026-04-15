import http from 'http';

import logger from './utils/logger.js';
import { API_PORT, APOLLO_PORT } from './config.js';
import createApolloServer from './apolloServer.js';
import app from './app.js';
import githubClient from './utils/githubClient.js';

const logGithubCredentialStatus = async () => {
  const validationResult = await githubClient.validateCredentials();

  if (!validationResult.configured) {
    logger.info(
      'GitHub API credentials are not configured; anonymous GitHub API access with strict rate limit will be used',
    );
    return;
  }

  if (validationResult.valid) {
    logger.info('GitHub API credentials validated successfully');
    return;
  }

  logger.warn(
    'GitHub API credential validation failed; anonymous GitHub API access with strict rate limit will be used',
  );
};

const startServer = async () => {
  const httpServer = http.createServer(app);

  const apolloServer = createApolloServer();

  await apolloServer.listen({ port: APOLLO_PORT });

  httpServer.on('request', app.callback());

  await new Promise((resolve) =>
    httpServer.listen({ port: API_PORT }, resolve),
  );

  await logGithubCredentialStatus();

  logger.info(`Apollo Server ready at http://localhost:${APOLLO_PORT}`);
};

startServer();
