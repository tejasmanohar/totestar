var express = require('express');
var request = require('superagent');

var router = express.Router();

function getData(username) {
  request
    .get('https://api.github.com/users/' + username)
    .end(function(error, res){
      console.log(JSON.parse(res.text).public_repos);
    });
}

router.post('/', function(req, res) {
  console.log(req.param('username'))
  getData(req.param('username'));
});

module.exports = router;
