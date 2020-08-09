const express = require('express');
const {create,list,listAllBlogsCategoriesTags,update,remove,read,photo,listRelated,listSearch,listByUser} = require('../controller/blog')
const { requireSignin,adminMiddleware,authMiddleware,canUpdateDeleteBlog} = require('../controller/auth')
const router = express.Router();
router.post('/blog', requireSignin,adminMiddleware, create)
router.get('/blogs',list)
router.post('/blogs-categories-tags',listAllBlogsCategoriesTags)
router.get('/blog/:slug',read)
router.put('/blog/:slug', requireSignin,adminMiddleware, update)
router.delete('/blog/:slug', requireSignin,adminMiddleware, remove)
router.get('/blog/photo/:slug',photo)
router.post('/blogs/related', listRelated)
router.get('/blogs/search', listSearch)

router.get('/:username/blogs',listByUser)
router.post('/user/blog', requireSignin,authMiddleware, create)
router.put('/user/blog/:slug', requireSignin,authMiddleware, canUpdateDeleteBlog,update)
router.delete('/user/blog/:slug', requireSignin,authMiddleware,canUpdateDeleteBlog, remove)



module.exports = router