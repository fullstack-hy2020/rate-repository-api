import { gql, ApolloError } from 'apollo-server';
import * as yup from 'yup';

import {
  githubClient,
  GithubRepositoryNotFoundError,
} from '../../utils/githubClient.js';

import Repository from '../../models/Repository.js';
import Review from '../../models/Review.js';

export const typeDefs = gql`
  input CreateReviewInput {
    repositoryName: String!
    ownerName: String!
    rating: Int!
    text: String
  }

  extend type Mutation {
    """
    Creates a review for the given repository defined by repositoryName and ownerName.
    """
    createReview(review: CreateReviewInput): Review
  }
`;

class RepositoryAlreadyReviewedError extends ApolloError {
  constructor(message = 'User has already reviewed this repository') {
    super(message, 'REPOSITORY_ALREADY_REVIEWED');
  }
}

const createRepositoryId = (ownerUsername, repositoryName) =>
  [ownerUsername, repositoryName].join('.');

const createReviewId = (userId, repositoryId) => {
  return [userId, repositoryId].join('.');
};

const argsSchema = yup.object().shape({
  review: yup.object().shape({
    repositoryName: yup.string().required().lowercase().trim(),
    ownerName: yup.string().required().lowercase().trim(),
    rating: yup.number().integer().min(0).max(100).required(),
    text: yup.string().max(2000).trim(),
  }),
});

export const resolvers = {
  Mutation: {
    createReview: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();

      const { review } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const { repositoryName, ownerName } = review;

      const existingRepository = await Repository.query().findOne({
        name: repositoryName,
        ownerName,
      });

      const repositoryId = existingRepository
        ? existingRepository.id
        : createRepositoryId(ownerName, repositoryName);

      if (!existingRepository) {
        const githubRepository = await githubClient.getRepository(
          ownerName,
          repositoryName,
        );

        if (!githubRepository) {
          throw GithubRepositoryNotFoundError.fromNames(
            ownerName,
            repositoryName,
          );
        }

        await Repository.query().insert({
          id: repositoryId,
          ownerName,
          name: repositoryName,
        });
      }

      const id = createReviewId(currentUser.id, repositoryId);

      const existringReview = await Review.query().findById(id);

      if (existringReview) {
        throw new RepositoryAlreadyReviewedError();
      }

      return Review.query().insertAndFetch({
        id,
        userId: currentUser.id,
        repositoryId,
        text: review.text,
        rating: review.rating,
      });
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
