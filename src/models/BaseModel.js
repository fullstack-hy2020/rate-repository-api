import { Model, QueryBuilder } from 'objection';

import cursorPaginate from '../utils/pagination/cursorPaginate.js';

export class BaseQueryBuilder extends QueryBuilder {
  cursorPaginate(options) {
    return cursorPaginate(this, options);
  }
}

export class BaseModel extends Model {
  static get useLimitInFirst() {
    return true;
  }

  static get QueryBuilder() {
    return BaseQueryBuilder;
  }

  $beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  $beforeUpdate() {
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
  }
}

export default BaseModel;
