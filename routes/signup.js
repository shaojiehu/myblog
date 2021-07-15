const router = require('koa-router')();
const model = require('../model/signup')

// 注册页面
router.get('/signup', model.getSignup)
// post 注册
router.post('/signup', model.postSignup)

module.exports = router