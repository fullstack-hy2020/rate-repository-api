import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type UserEdge {
    cursor: String!
    node: User!
  }

  type UserConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [UserEdge!]!
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
