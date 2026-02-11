import BaseModel from './BaseModel.js';
import knex from '../utils/knex.js';

class Review extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'reviews';
  }
}

export default Review.bindKnex(knex);
