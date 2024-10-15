// Blog website backend server

// Importing dependencies
const express = require('express');
const path = require('path');
const { readPosts, addPost, getPostById, savePosts } = require('./utilities');
const { PostsPath } = require('./constant.js');

// Initialize express application
const app = express();
const PORT = 8080;

// Configure middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Website'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));

// Route: Home page - Display all blog posts
app.get('/', async (req, res) => {
    try {
        const { posts } = await readPosts(PostsPath);
        res.render('index', {
            title: 'Blog Hub',
            message: 'Welcome to the Blog Hub!',
            posts,
            category: 'All'
        });
    } catch (error) {
        console.error('Error loading posts:', error);
        res.status(500).send('Unable to load posts');
    }
});

// Route: Create a new blog post
app.post('/submit', async (req, res) => {
    const timestamp = new Date().toLocaleString();
    const newPost = { ...req.body, time: timestamp };
    await addPost(PostsPath, newPost);
    res.redirect('/');
});

// Route: Filter posts by category
app.get('/posts', async (req, res) => {
    const selectedCategory = req.query.category;
    let { posts } = await readPosts(PostsPath);

    if (selectedCategory !== 'All') {
        posts = posts.filter(post => post.category === selectedCategory);
    }

    res.render('index', {
        title: 'Blog Hub',
        message: `Posts in ${selectedCategory}`,
        posts,
        category: selectedCategory
    });
});

// Route: Edit post - Load post data for editing
app.get('/editPost', async (req, res) => {
    const postId = req.query.post;
    const { posts } = await readPosts(PostsPath);
    const { post } = getPostById(postId, posts);

    res.render('editPost', { post });
});

// Route: Submit the edited post
app.post('/editPost', async (req, res) => {
    let { posts } = await readPosts(PostsPath);
    const updatedPost = req.body;
    const { index } = getPostById(updatedPost.id, posts);

    posts[index] = updatedPost;
    await savePosts(posts);

    console.log('Post updated successfully');
    res.redirect('/');
});

// Route: Delete a blog post
app.get('/deletePost', async (req, res) => {
    const postId = req.query.post;
    let { posts } = await readPosts(PostsPath);

    const { index } = getPostById(postId, posts);
    posts.length === 1 ? (posts = []) : posts.splice(index, 1);

    await savePosts(posts);
    console.log('Post deleted');
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
