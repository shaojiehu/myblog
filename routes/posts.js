const router = require('koa-router')();
const model = require('../model/posts')

// 重置到文章页
router.get('/', model.getRedirectPosts)
// 文章页
router.get('/posts', model.getPosts)
// 首页分页，每次输出10条
router.post('/posts/page', model.postPostsPage)
// 个人文章分页，每次输出10条
router.post('/posts/self/page', model.postSelfPage)
// 单篇文章页
router.get('/posts/:postId', model.getSinglePosts)
// 发表文章页面
router.get('/create', model.getCreate)
// post 发表文章
router.post('/create', model.postCreate)
// 发表评论
router.post('/:postId',model.postComment)
// 编辑单篇文章页面
router.get('/posts/:postId/edit', model.getEditPage)
// post 编辑单篇文章
router.post('/posts/:postId/edit', model.postEditPage)
// 删除单篇文章
router.post('/posts/:postId/remove', model.postDeletePost)
// 删除评论
router.post('/posts/:postId/comment/:commentId/remove', model.postDeleteComment)
// 评论分页
router.post('/posts/:postId/commentPage', model.postCommentPage)

module.exports = router