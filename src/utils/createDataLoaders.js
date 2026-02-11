import DataLoader from 'dataloader';
import lodash from 'lodash';
const { camelCase, isArray, find, zipObject } = lodash;

import Repository from '../models/Repository.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

const jsonCacheKeyFn = (value) => JSON.stringify(value);

const createModelLoader = (Model) =>
  new DataLoader(
    async (ids) => {
      const idColumns = isArray(Model.idColumn)
        ? Model.idColumn
        : [Model.idColumn];

      const camelCasedIdColumns = idColumns.map((id) => camelCase(id));

      const results = await Model.query().findByIds(ids);

      return ids.map(
        (id) =>
          find(
            results,
            zipObject(camelCasedIdColumns, isArray(id) ? id : [id]),
          ) || null,
      );
    },
    {
      cacheKeyFn: jsonCacheKeyFn,
    },
  );

const createRepositoryRatingAverageLoader = () =>
  new DataLoader(async (repositoryIds) => {
    const reviews = await Review.query()
      .whereIn('repositoryId', repositoryIds)
      .avg('rating', { as: 'ratingAverage' })
      .groupBy('repositoryId')
      .select('repositoryId');

    return repositoryIds.map((id) => {
      const review = reviews.find(({ repositoryId }) => repositoryId === id);

      return review ? review.ratingAverage : 0;
    });
  });

const createRepositoryReviewCountLoader = () =>
  new DataLoader(async (repositoryIds) => {
    const reviews = await Review.query()
      .whereIn('repositoryId', repositoryIds)
      .count('*', { as: 'reviewsCount' })
      .groupBy('repositoryId')
      .select('repositoryId');

    return repositoryIds.map((id) => {
      const review = reviews.find(({ repositoryId }) => repositoryId === id);

      return review ? review.reviewsCount : 0;
    });
  });

const createUserRepositoryReviewExistsLoader = () =>
  new DataLoader(
    async (userIdRepositoryIdTuples) => {
      const userIds = userIdRepositoryIdTuples.map(([userId]) => userId);
      const repositoryIds = userIdRepositoryIdTuples.map(
        ([, repositoryId]) => repositoryId,
      );

      const reviews = await Review.query()
        .whereIn('repositoryId', repositoryIds)
        .andWhere((qb) => qb.whereIn('userId', userIds))
        .select('repositoryId', 'userId');

      return userIdRepositoryIdTuples.map(([userId, repositoryId]) => {
        return !!reviews.find(
          (r) => r.userId === userId && r.repositoryId === repositoryId,
        );
      });
    },
    {
      cacheKeyFn: jsonCacheKeyFn,
    },
  );

const createUserReviewCountLoader = () =>
  new DataLoader(async (userIds) => {
    const reviews = await Review.query()
      .whereIn('userId', userIds)
      .count('*', { as: 'reviewsCount' })
      .groupBy('userId')
      .select('userId');

    return userIds.map((id) => {
      const review = reviews.find(({ userId }) => userId === id);

      return review ? review.reviewsCount : 0;
    });
  });

export const createDataLoaders = () => {
  return {
    repositoryLoader: createModelLoader(Repository),
    userLoader: createModelLoader(User),
    reviewLoader: createModelLoader(Review),
    repositoryRatingAverageLoader: createRepositoryRatingAverageLoader(),
    repositoryReviewCountLoader: createRepositoryReviewCountLoader(),
    userRepositoryReviewExistsLoader: createUserRepositoryReviewExistsLoader(),
    userReviewCountLoader: createUserReviewCountLoader(),
  };
};

export default createDataLoaders;
