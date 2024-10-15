// Paths and constants for the blog application
const path = require('path');

// Define the path to the blog posts JSON file
const PostsPath = path.join(__dirname, 'blogPosts.json');

// Export the constants for use in other modules
module.exports = {
    PostsPath
};
