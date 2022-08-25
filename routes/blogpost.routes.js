const BlogPost = require("../models/blogpost.model")
const User = require("../models/User.model")
const router = require("express").Router();
const fileUploader = require('../config/cloudinary.config');

router.post('/post/create', fileUploader.single('post-header-image'), (req, res) => {
    const { title, content } = req.body;
    const myAuthorId = req.session.currentUser._id;
})