const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');

// Create a new blog post
router.post('/posts', async (req, res) => {
    try {
        const blogPost = new BlogPost(req.body);
        await blogPost.save();
        res.status(201).send(blogPost);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all blog posts
router.get('/posts', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        res.send(blogPosts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a single blog post
router.get('/posts/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).send();
        }
        res.send(blogPost);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a blog post
router.patch('/posts/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!blogPost) {
            return res.status(404).send();
        }
        res.send(blogPost);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a blog post
router.delete('/posts/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!blogPost) {
            return res.status(404).send();
        }
        res.send(blogPost);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Publish a blog post
router.patch('/posts/:id/publish', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).send();
        }
        blogPost.status = 'published';
        blogPost.updatedAt = new Date();
        await blogPost.save();
        res.send(blogPost);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Draft a blog post
router.patch('/posts/:id/draft', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).send();
        }
        blogPost.status = 'draft';
        blogPost.updatedAt = new Date();
        await blogPost.save();
        res.send(blogPost);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
