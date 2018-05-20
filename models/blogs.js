var mongoose = require('mongoose');

// Blog Schema/ db table
var blogSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    blog:{
        type: String,
        required: true
    }
})
// Export so that it is accessible from anywhere
var Blog = module.exports = mongoose.model('Blog', blogSchema)

// Get Blogs
module.exports.getBlogs = function(callback, limit){
    Blog.find(callback).limit(limit);
}

// Get one Blog
module.exports.getBlogById = function(id, callback){
    Blog.findById(id, callback);
}

// Add Blog
module.exports.addBlog = function(blog, callback){
    Blog.create(blog, callback);
}

// Update Blog
module.exports.updateBlog = function(id, blog, options, callback){
    var query = {_id: id};
    var update = {
        title: blog.title,
        posts: blog.posts
    }
    Blog.findOneAndUpdate(query, update, options, callback);
}

// Delete Blog
module.exports.removeBlog = function(id, callback){
    var query = {_id:id}
    Blog.remove(query, callback);
}