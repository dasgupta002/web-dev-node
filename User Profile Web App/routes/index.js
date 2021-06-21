var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  const users = req.app.locals.users;
  
  users.find().limit(3).toArray((error, recent) => {
    res.render('index', { recent });
  });
});

module.exports = router;