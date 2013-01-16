'use strict';

function ListPostCtrl($scope, $http) {
  $http.get('/posts/list').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
}
 
function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/posts/create', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}
 
function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/posts/show/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}
 
function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/posts/show/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });
    
  $scope.editPost = function () {
    $http.put('/posts/update/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}
 
function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/posts/show/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
    
  $scope.deletePost = function () {
    $http.delete('/posts/destroy/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };
  
  $scope.home = function () {
    $location.url('/');
  };
}