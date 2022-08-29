const BlogPost = require("../models/blogpost.model")
const User = require("../models/User.model")
const router = require("express").Router();
const fileUploader = require('../config/cloudinary.config');


//CREATE A POST ROUTE

router.get('/post/create', (req,res,next) =>{
    res.render('blogpost.hbs')
})

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

//ALL POSTS BELONGING TO USER

router.get('/myPosts', (req, res, next) => {
    const myUserId = req.session.currentUser._id
    User.findById(myUserId)
    .populate('blogposts')
    .then(userWithPosts => {
        console.log(' Blog posts from the DB: ', userWithPosts);
        res.render('blogpostlist.hbs', { blogposts: userWithPosts.blogposts})
    })
    .catch(err => {
        console.log(`Error while getting the posts from the DB: ${err} `)
        next(err);
    })  

})
//GET ONE POST ROUTE
router.get('post/:postId', (req ,res, next) => {
    const { postId } = req.params;
    BlogPost.findById(postId)
    .populate('userId')
    .then(foundPost => {
        console.log(foundPost)
        res.render('blogpost-details.hbs', foundPost)
    })
    .catch(err => {
        console.log(`Error while getting a single post from the DB: ${err}`)
        next(err);
    })
})

//EDIT SINGLE POST ROUTE

router.get('/post/:postId/edit', (req, res, next) => {
    const { postId } = req.params;
    BlogPost.findById(postId)
    .then(postToEdit => {
        res.render('blogpost-edit', { blogpost: postToEdit});
        console.log(postToEdit)
    })
    .catch(error => next(error));

});

router.post('/post/:postId/edit', (req, res, next) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    BlogPost.findByIdAndUpdate(postId, {title, content, imageUrl}, {new: true})
    .then(updatedPost => {
        console.log(updatedPost)
        res.redirect('/myPosts')
    })
    .catch(error => next(error))
})

router.post('/post/:postId/delete', (req,res,next) => {
    const postId = req.params.postId;

    BlogPost.findByIdAndDelete(postId)
    .then(() => res.redirect('/myPosts'))
    .catch(error => next(error));
})

module.exports = router;