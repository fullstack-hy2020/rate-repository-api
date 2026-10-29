import { GraphQLError } from 'graphql';
import { gql } from 'graphql-tag';

import Review from '../../models/Review.js';

export const typeDefs = gql`
  extend type Mutation {
    """
    Deletes the review which has the given id, if it is created by the authorized user.
    """
    deleteReview(id: ID!): Boolean
  }
`;

export const resolvers = {
  Mutation: {
    deleteReview: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();

      const review = await Review.query().findById(args.id);

      if (!review) {
        throw new GraphQLError(`Review with id ${args.id} does not exist`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (review.userId !== currentUser.id) {
        throw new GraphQLError('User is not authorized to delete the review', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await Review.query().findById(args.id).delete();

      return true;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
