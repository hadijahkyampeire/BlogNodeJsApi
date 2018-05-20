var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');

app.use(bodyParser.json());

User = require('./models/users');
Blog = require('./models/blogs');

// connect to mongoose
mongoose.connect('mongodb://localhost/blog');

// db object
var db = mongoose.connection;

app.get('/', function(req, res) {
  res.send('Welcome to blog Api in NodeJs');
});

// Register user
app.post('/api/auth/register', function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var user = {
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  };
  if (!user.username)return res.status(400).send({message:"username required please"});
  if (!user.email)return res.status(400).send({message:"email required please"});
  if (!user.password)return res.status(400).send({message:"password required please"});
  User.findOne({email: req.body.email}, function(err, user){
    if (user) return res.status(400).send({message:'user already exists, login.'});
  })
  User.registerUser(user, function(err, user) {
    if (err) {
      throw err;
    }
    res.json({
      username: user.username,
      status: 201,
      success: true,
      message: 'Registration successful, login',
    });
  });
});

// Login
app.post('/api/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found. Please register');
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });
    //   create token jwt.sign takes the payload and secret key from config.js
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // expires in 24 hours
    });
    res
      .status(200)
      .send({ auth: true, token: token, message: 'logged in successfully' });
  });
});

// Get all blogs
app.get('/api/blogs', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided.' });
    Blog.getBlogs(function(err, blogs) {
    if (err) {
      throw err;
    }
    res.json(blogs);
  });
});

//  Get one blog by id
app.get('/api/blogs/:_id', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided.' });
    Blog.getBlogById(function(err, blog) {
    if (err) {
      throw err;
    }
    res.json(blog);
  });
});

// Add blog
app.post('/api/blogs', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided.' });
    var blog = req.body;
    Blog.addBlog(blog, function(err, blog) {
    if(!blog.title)
    return res.status(401).send({ post: false, message: 'Please enter title.' });
    if(!blog.blog)
    return res.status(401).send({ post: false, message: 'Please enter blog.' });
    if (err) {
      throw err;
    }
    res.json({
      blog: blog,
      success: true,
      message: 'blog added successfully',
    });
  });
});

// Edit blog
app.put('/api/blogs/:_id', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided.' });
    var id = req.params._id;
    var blog = req.body;
    Blog.updateBlog(id, blog, {}, function(err, blog) {
    if(!blog.title)
    return res.status(401).send({ post: false, message: 'Please enter title.' });
    if(!blog.blog)
    return res.status(401).send({ post: false, message: 'Please enter blog.' });
    if (err) {
      throw err;
    }
    res.json({
      blog: blog,
      success: true,
      message: 'blog updated successfully',
    });
  });
});

// delete blog
app.delete('/api/blogs/:_id', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided.' });
    var id = req.params._id;
    var blog = req.body;
    Blog.removeBlog(id, function(err, blog) {
    if (err) {
      throw err;
    }
    res.json({
      success: true,
      message: 'blog deleted successfully',
    });
  });
});

app.listen('3000');
console.log('Blog NodeJs api...');
