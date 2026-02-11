import { gql } from 'apollo-server';
import { raw } from 'objection';
import * as yup from 'yup';

import Repository from '../../models/Repository.js';

export const typeDefs = gql`
  enum AllRepositoriesOrderBy {
    CREATED_AT
    RATING_AVERAGE
  }

  extend type Query {
    """
    Returns paginated repositories.
    """
    repositories(
      after: String
      first: Int
      orderDirection: OrderDirection
      orderBy: AllRepositoriesOrderBy
      searchKeyword: String
      ownerName: String
    ): RepositoryConnection!
  }
`;

const argsSchema = yup.object({
  after: yup.string(),
  first: yup.number().min(1).max(30).default(30),
  orderDirection: yup.string().default('DESC'),
  orderBy: yup.string().default('CREATED_AT'),
  searchKeyword: yup.string().trim(),
  ownerName: yup.string().trim(),
});

const orderColumnByOrderBy = {
  CREATED_AT: 'createdAt',
  RATING_AVERAGE: 'ratingAverage',
};

const getLikeFilter = (value) => `%${value}%`;

export const resolvers = {
  Query: {
    repositories: async (obj, args) => {
      const normalizedArgs = await argsSchema.validate(args);

      const {
        first,
        orderDirection,
        after,
        orderBy,
        searchKeyword,
        ownerName,
      } = normalizedArgs;

      const orderColumn = orderColumnByOrderBy[orderBy];

      let query = Repository.query();

      if (ownerName) {
        query = query.where({
          ownerName,
        });
      } else if (searchKeyword) {
        const likeFilter = getLikeFilter(searchKeyword);

        query = query.where((qb) => {
          return qb
            .where('ownerName', 'like', likeFilter)
            .orWhere('name', 'like', likeFilter);
        });
      }

      if (orderColumn === 'ratingAverage') {
        query = query.select([
          'repositories.*',
          // Missing reviews should have average of 0 not null
          raw(
            'coalesce((select avg(rating) as rating_average from reviews where repository_id = repositories.id group by repository_id), 0) as rating_average',
          ),
        ]);
      }

      return query.cursorPaginate({
        first,
        after,
        orderBy: [
          { column: orderColumn, order: orderDirection.toLowerCase() },
          'id',
        ],
      });
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
