import { gql } from 'apollo-server';
import lodash from 'lodash';
const { merge } = lodash;

import Repository from './types/Repository.js';
import repositoryQuery from './queries/repository.js';
import User from './types/User.js';
import createUserMutation from './mutations/createUser.js';
import authenticateMutation from './mutations/authenticate.js';
import usersQuery from './queries/users.js';
import meQuery from './queries/me.js';
import repositoriesQuery from './queries/repositories.js';
import PageInfo from './types/PageInfo.js';
import RepositoryConnection from './types/RepositoryConnection.js';
import OrderDirection from './enums/OrderDirection.js';
import createReviewMutation from './mutations/createReview.js';
import Review from './types/Review.js';
import ReviewConnection from './types/ReviewConnection.js';
import UserConnection from './types/UserConnection.js';
import deleteReviewMutation from './mutations/deleteReview.js';
import DateTime from './scalars/DateTime.js';

const rootTypeDefs = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;

export const typeDefs = [
  rootTypeDefs,
  DateTime.typeDefs,
  Repository.typeDefs,
  repositoryQuery.typeDefs,
  User.typeDefs,
  createUserMutation.typeDefs,
  authenticateMutation.typeDefs,
  usersQuery.typeDefs,
  meQuery.typeDefs,
  repositoriesQuery.typeDefs,
  PageInfo.typeDefs,
  RepositoryConnection.typeDefs,
  OrderDirection.typeDefs,
  createReviewMutation.typeDefs,
  Review.typeDefs,
  ReviewConnection.typeDefs,
  UserConnection.typeDefs,
  deleteReviewMutation.typeDefs,
];

export const resolvers = merge(
  DateTime.resolvers,
  Repository.resolvers,
  repositoryQuery.resolvers,
  User.resolvers,
  createUserMutation.resolvers,
  authenticateMutation.resolvers,
  usersQuery.resolvers,
  meQuery.resolvers,
  repositoriesQuery.resolvers,
  PageInfo.resolvers,
  RepositoryConnection.resolvers,
  OrderDirection.resolvers,
  createReviewMutation.resolvers,
  Review.resolvers,
  ReviewConnection.resolvers,
  UserConnection.resolvers,
  deleteReviewMutation.resolvers,
);
