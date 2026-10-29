import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type ReviewEdge {
    cursor: String!
    node: Review!
  }

  type ReviewConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [ReviewEdge!]!
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
