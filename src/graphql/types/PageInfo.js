import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: String
    endCursor: String
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
