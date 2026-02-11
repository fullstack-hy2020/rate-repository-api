import BaseModel from './BaseModel.js';
import knex from '../utils/knex.js';

class Repository extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'repositories';
  }
}

export default Repository.bindKnex(knex);
