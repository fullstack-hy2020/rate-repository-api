import Router from 'koa-router';

import getRepositories from './getRepositories.js';

const router = new Router();

router.get('/', getRepositories);

export default router;
