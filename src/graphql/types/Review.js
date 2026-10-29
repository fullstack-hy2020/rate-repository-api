import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Review {
    id: ID!
    user: User!
    repository: Repository!
    userId: String!
    repositoryId: String!
    rating: Int!
    createdAt: DateTime!
    text: String
  }
`;

export const resolvers = {
  Review: {
    user: async ({ userId }, args, { dataLoaders: { userLoader } }) =>
      userLoader.load(userId),
    repository: (
      { repositoryId },
      args,
      { dataLoaders: { repositoryLoader } },
    ) => repositoryLoader.load(repositoryId),
  },
};

export default {
  typeDefs,
  resolvers,
};
