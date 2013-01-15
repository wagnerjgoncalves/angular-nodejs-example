
// CouchDb configuration and setup
var cradle = require('cradle'),
    config = require('../config/db')['development']; 

var conn = new(cradle.Connection)(config.url, config.port, {
  cache: true,
  raw: false
});

var db = conn.database(config.database);
db.exists(function (err, exists) {
  if (err) {
    console.log('Error try verify if database exists', err);
  } else if (exists) {
    console.log('Database already exists');
  } else {
    console.log('Database does not exists and will be created');
    db.create();
  }
});

// LIST
exports.posts = function(req,res){
  var posts = [];
  db.view('posts/all', function(err , results){
    results.forEach(function(id,post){
      posts.push({
        id:id,
        title: post.title,
        text: post.text
      });
    });
    res.json({
      posts:posts
    });
  });
};

// GET BY ID
exports.post = function(req,res){
  var id = req.params.id;
  db.get(id, function(err, doc){
    if(err){
      res.json(false);  
    }else{
      res.json({
        post: doc
      });
    }
  });
};


// NEW POST
exports.addPost = function(req,res){
  var post = req.body;
  post.resource = 'Post';
  db.save(post, function (err, ret) {
    if (err) {
      res.json(false);
    }
    res.json(post);
  });
};

// EDIT POST
exports.editPost = function(req, res){
  var id = req.params.id;
  var post = req.body;
  post.resource = 'Post';
  db.merge(id, post, function(err,result){
    if(err)
      res.json(false);
    else
      res.json(true);
  });
};

// DELETE POST
exports.deletePost = function(req, res){
  var id = req.params.id;
  db.remove(id, function(err,result){
    if(err)
      res.json(false);  
    else
      res.json(true);
  });
};