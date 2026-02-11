import lodash from 'lodash';
const { isNumber } = lodash;

import normalizeOrderBy from './normalizeOrderBy.js';
import reverseOrderBy from './reverseOrderBy.js';
import serializeCursor from './serializeCursor.js';
import parseCursor from './parseCursor.js';
import cursorWhere from './cursorWhere.js';

const getValidLimitOrFail = ({ first, last }) => {
  const limit = isNumber(first) ? first : isNumber(last) ? last : 30;

  if (limit < 0 || limit > 100) {
    throw new Error(
      'Limit must be greater than 0 and less than or equal to 100',
    );
  }

  return limit;
};

const createCursor = (row, orderBy) => {
  const payload = orderBy.map(({ column }) => row[column]);

  return serializeCursor(payload);
};

const cursorPaginate = async (
  builder,
  { orderBy: orderByOption, after, before, first, last },
) => {
  let orderBy = normalizeOrderBy(orderByOption);

  if (orderBy.length === 0) {
    throw new Error('At least one order by column must be provided');
  }

  if (before) {
    orderBy = reverseOrderBy(orderBy);
  }

  const limit = getValidLimitOrFail({ first, last });

  const cursor = after
    ? parseCursor(after)
    : before
    ? parseCursor(before)
    : null;

  const cursorQuery = cursor
    ? builder.clone().andWhere((b) => cursorWhere(b, orderBy, cursor))
    : builder;

  const paginationQuery = cursorQuery.clone().limit(limit).orderBy(orderBy);

  const cursorCountQuery = cursorQuery.clone().count({ count: '*' }).first();

  const totalCountQuery = builder.clone().count({ count: '*' }).first();

  const [rows, cursorCountObject, totalCountObject] = await Promise.all([
    paginationQuery,
    cursorCountQuery,
    totalCountQuery,
  ]);

  const { count: cursorCount } = cursorCountObject;
  const { count: totalCount } = totalCountObject;

  if (before) {
    rows.reverse();
  }

  const remaining = cursorCount - rows.length;

  const hasNextPage =
    (!before && remaining > 0) ||
    (Boolean(before) && totalCount - cursorCount > 0);

  const hasPreviousPage =
    (Boolean(before) && remaining > 0) ||
    (!before && totalCount - cursorCount > 0);

  const edges = rows.map((node) => ({
    node,
    cursor: createCursor(node, orderBy),
  }));

  const pageInfo = {
    hasNextPage,
    hasPreviousPage,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
  };

  return {
    totalCount,
    edges,
    pageInfo,
  };
};

export default cursorPaginate;
