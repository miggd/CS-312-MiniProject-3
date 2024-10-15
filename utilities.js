const fs = require('fs').promises; // Use promises directly from fs
const { PostsPath } = require('./constants.js');

// Reads blog posts from the file and returns them as an array
const readPosts = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        let posts = JSON.parse(data);

        // Ensure the data is an array
        if (!Array.isArray(posts)) posts = [posts];

        // Get the ID of the last post for tracking
        const lastId = posts.length > 0 ? posts[posts.length - 1].id : 0;

        console.log('Posts retrieved:', posts);
        return { posts, lastId };
    } catch (error) {
        console.error('Error reading posts:', error);
        return { posts: [], lastId: 0 }; // Return an empty array on error
    }
};

// Adds a new post to the file
const addPost = async (filePath, newPost) => {
    const { posts, lastId } = await readPosts(filePath);

    // Assign a new ID to the post
    newPost.id = lastId + 1;

    // Add the new post and prepare to save it
    posts.push(newPost);
    const formattedData = JSON.stringify(posts, null, 2);

    try {
        await fs.writeFile(filePath, formattedData);
        console.log(`New post added with ID: ${newPost.id}`);
    } catch (error) {
        console.error('Error adding post:', error);
    }
};

// Retrieves a post by its ID from a given list of posts
const getPostById = (id, posts) => {
    console.log('Searching for post with ID:', id);

    // Find the index of the post with the matching ID
    const index = posts.findIndex(post => String(post.id) === String(id));

    if (index === -1) {
        console.error(`Post with ID ${id} not found.`);
        return { post: null, index: -1 };
    }

    console.log('Post found:', posts[index]);
    return { post: posts[index], index };
};

// Saves the list of posts to the file
const savePosts = async (posts) => {
    const formattedData = JSON.stringify(posts, null, 2);

    try {
        await fs.writeFile(PostsPath, formattedData);
        console.log('All posts saved successfully.');
    } catch (error) {
        console.error('Error saving posts:', error);
    }
};

// Exporting the functions for external use
module.exports = {
    readPosts,
    addPost,
    getPostById,
    savePosts
};
