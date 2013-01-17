var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api');

var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/partials/:name', routes.partials);

var post = new api.Post();
app.get('/posts/list', post.list);
app.get('/posts/show/:id', post.show);
app.post('/posts/create', post.create);
app.put('/posts/update/:id', post.update);
app.delete('/posts/destroy/:id', post.destroy);

app.get('*', routes.index);

var port = process.env.PORT || 5000; 
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
