import createKnex from 'knex';

import { KNEX_CONFIG } from '../config.js';

const knex = createKnex(KNEX_CONFIG);

export default knex;
