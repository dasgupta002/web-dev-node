var express = require('express');
var objectID = require('mongodb').ObjectID;
var router = express.Router();

router.get('/', (req, res) => {
  if(!req.isAuthenticated()) res.redirect('/auth/login');
  
  const users = req.app.locals.users;
  const _id = objectID(req.session.passport.user);
  
  users.findOne({ _id }, (error, results) => {
    if(error) throw error;
    
    res.render('account', { ...results });
  });
});

router.get('/:username', (req, res) => {
  const users = req.app.locals.users;
  const username = req.params.username;

  users.findOne({ username }, (error, results) => {
    if(error || !results) res.render('public', { messages: { error: ['User does not exist! Try for another hit.'] } });

    res.render('public', { ...results, username });
  });
});

router.post('/', (req, res) => {
  if(!req.isAuthenticated()) res.redirect('/auth/login');
  
  const users = req.app.locals.users;
  const { name, github, twitter, facebook } = req.body;
  const _id = objectID(req.session.passport.user);
  
  users.updateOne({ _id }, { $set: { name, github, twitter, facebook } }, (error) => { 
    if(error) throw error; 
    req.flash('success', 'Wohoo! Updated your user data.');
    
    res.redirect('/users');
  });
});

module.exports = router;