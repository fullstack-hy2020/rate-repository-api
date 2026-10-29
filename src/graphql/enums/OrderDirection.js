import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum OrderDirection {
    ASC
    DESC
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
