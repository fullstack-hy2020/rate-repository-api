import { gql } from 'apollo-server';
import lodash from 'lodash';
const { get } = lodash;
import * as yup from 'yup';

import githubClient from '../../utils/githubClient.js';
import Review from '../../models/Review.js';

export const typeDefs = gql`
  type Repository {
    id: ID!
    ownerName: String!
    name: String!
    user: User!
    createdAt: DateTime!
    fullName: String!
    reviews(first: Int, after: String): ReviewConnection!
    ratingAverage: Int!
    reviewCount: Int!
    stargazersCount: Int
    watchersCount: Int
    forksCount: Int
    openIssuesCount: Int
    url: String
    ownerAvatarUrl: String
    description: String
    language: String
    userHasReviewed: Boolean
  }
`;

const argsSchema = yup.object({
  after: yup.string(),
  first: yup.number().min(1).max(30).default(30),
});

const makeGithubRepositoryResolver =
  (getValue) =>
  async ({ ownerName, name }) => {
    return getValue(await githubClient.getRepository(ownerName, name));
  };

export const resolvers = {
  Repository: {
    user: ({ userId }, args, { dataLoaders: { userLoader } }) => {
      return userLoader.load(userId);
    },
    reviews: async ({ id }, args) => {
      const { first, after } = await argsSchema.validate(args);

      return Review.query()
        .where({
          repositoryId: id,
        })
        .cursorPaginate({
          orderBy: [{ column: 'createdAt', direction: 'desc' }, 'id'],
          first,
          after,
        });
    },
    ratingAverage: async (
      { id },
      args,
      { dataLoaders: { repositoryRatingAverageLoader } },
    ) => Math.round(await repositoryRatingAverageLoader.load(id)),
    reviewCount: (
      { id },
      args,
      { dataLoaders: { repositoryReviewCountLoader } },
    ) => repositoryReviewCountLoader.load(id),
    userHasReviewed: async (
      { id },
      args,
      { dataLoaders: { userRepositoryReviewExistsLoader }, authService },
    ) => {
      const currentUser = await authService.getUser();

      return currentUser
        ? userRepositoryReviewExistsLoader.load([currentUser.id, id])
        : null;
    },
    fullName: ({ ownerName, name }) => [ownerName, name].join('/'),
    ownerAvatarUrl: makeGithubRepositoryResolver((repository) =>
      get(repository, 'owner.avatar_url'),
    ),
    description: makeGithubRepositoryResolver((repository) =>
      get(repository, 'description'),
    ),
    stargazersCount: makeGithubRepositoryResolver(
      (repository) => get(repository, 'stargazers_count') || 0,
    ),
    watchersCount: makeGithubRepositoryResolver(
      (repository) => get(repository, 'watchers_count') || 0,
    ),
    forksCount: makeGithubRepositoryResolver(
      (repository) => get(repository, 'forks_count') || 0,
    ),
    openIssuesCount: makeGithubRepositoryResolver(
      (repository) => get(repository, 'open_issues_count') || 0,
    ),
    url: makeGithubRepositoryResolver((repository) =>
      get(repository, 'html_url'),
    ),
    language: makeGithubRepositoryResolver((repository) =>
      get(repository, 'language'),
    ),
  },
};

export default {
  typeDefs,
  resolvers,
};
