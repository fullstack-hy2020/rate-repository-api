import BaseModel from './BaseModel.js';
import knex from '../utils/knex.js';

class User extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'users';
  }
}

export default User.bindKnex(knex);
