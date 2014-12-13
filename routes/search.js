var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.json({ a: 1 });
});

module.exports = router;
