const router = require('koa-router')();
const model = require('../model/signin')

router.get('/signin', model.getSignin)
router.post('/signin', model.postSignin)

module.exports = router