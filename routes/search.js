var express = require('express');
var request = require('superagent');
 
var router = express.Router();

function getData(username, callback) {
  console.log(process.env.GH_USERNAME + process.env.GH_PASSWORD)
  request
    .get('https://api.github.com/users/' + username)
    .auth(process.env.GH_USERNAME, process.env.GH_PASSWORD)
    .end(function(error, res){
      var reposCount = JSON.parse(res.text).public_repos;
      
      var pages = Math.ceil(res.public_repos / 100),
        starTotal = 0;
      
      (function next(page) {
      getStarCount(page, username, function (err, stars) {
        if (err) { return callback(err); }
        starTotal += stars;
        
        if (page === pages) {
          callback(null, starTotal);
        } else {
          next(page + 1);
        }
      })
      })(1);
    });
}
 
function getStarCount(page, username, callback) {
  request
    .get('https://api.github.com/users/' + username + '/repos?per_page=100&page=' + page)
    .auth(process.env.GH_USERNAME, process.env.GH_PASSWORD)
    .end(function(err, res){
      if (err) { return callback(err); }
      var data = JSON.parse(res.text);
      var stars = data.reduce(function (acc, obj) { 
        return acc + obj.stargazers_count;
      }, 0);
      callback(null, stars);
    });
}
 
router.post('/', function(req, res, next) {
  getData(req.param('username'), function (err, count) {
    if (err) { return next(err); }
    res.send(count);
  });
});
 
module.exports = router;