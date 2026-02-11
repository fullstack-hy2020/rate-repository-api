import Router from 'koa-router';

import repositories from './repositories/index.js';

const router = new Router();

router.use('/repositories', repositories.routes());

export default router;
