const BlogPost = require("../models/blogpost.model")
const User = require("../models/User.model")
const router = require("express").Router();
const fileUploader = require('../config/cloudinary.config');

router.post('/post/create', fileUploader.single('post-header-image'), (req, res) => {
    const { title, content } = req.body;
    const myAuthorId = req.session.currentUser._id
   
    BlogPost.create({ title, content, imageUrl: req.file.path, userId: myAuthorId})
    .then(newlyCreatedBlogPostFromDB => {
        console.log(newlyCreatedBlogPostFromDB);
        return User.findByIdAndUpdate(myAuthorId, { $push: { blogposts: newlyCreatedBlogPostFromDB._id}});

    })
    .then( () => res.redirect('/myPosts'))
    .catch(error => console.log(`Error while created a new post: ${error}`));

});

router.get('/myPosts', (req, res, next) => {
    const myUserId = req.session.currentUser._id
    User.findById(myUserId)
    .populate('blogposts')
    .then(userWithPosts => {
        console.log(' Blog posts from the DB: ', userWithPosts);
        res.render('blogpost.hbs')
    })


})


module.exports = router;