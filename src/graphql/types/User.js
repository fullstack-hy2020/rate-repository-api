import { gql } from 'apollo-server';
import * as yup from 'yup';

import Review from '../../models/Review.js';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: DateTime!
    reviews(first: Int, after: String): ReviewConnection!
    reviewCount: Int!
  }
`;

const argsSchema = yup.object({
  after: yup.string(),
  first: yup.number().min(1).max(30).default(30),
});

export const resolvers = {
  User: {
    reviews: async ({ id }, args) => {
      const { first, after } = await argsSchema.validate(args);

      return Review.query()
        .where({
          userId: id,
        })
        .cursorPaginate({
          orderBy: [{ column: 'createdAt', order: 'desc' }, 'id'],
          first,
          after,
        });
    },
    reviewCount: async (
      { id },
      args,
      { dataLoaders: { userReviewCountLoader } },
    ) => userReviewCountLoader.load(id),
  },
};

export default {
  typeDefs,
  resolvers,
};
