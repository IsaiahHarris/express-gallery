const express = require('express')
const router = express.Router();
const User = require('../models/User')
const helper = require('./helper')

router.use(helper.isAuthenticated)

router.get('/', (req, res) => {
  return User
    .query({ where: { deleted_at: null } })
    .fetchAll()
    .then(users => {
      let usersArr = users.map(element => {
        return element.attributes;
      })
      if (!users) {
        return res.json({ "message": "there is no users" })
      } else {
        res.render('users/home', {
          users: usersArr,
          id: usersArr[0].id
        })
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ "message": "there was an error" })
    })
})

router.get('/:id', (req, res) => {
  let id = req.params.id;
  return new User({ id: id })
    .query({ where: { deleted_at: null } })
    .fetch({
      withRelated: ['arts']
    })
    .then(user => {
      let usersInfo = user.toJSON()
      let arts = user.related('arts').toJSON()
      res.render('users/user', {
        posts: arts,
        u: usersInfo
      })
    })
    .catch(err => {
      res.json({ "message": err.message })
    })
})

router.delete('/:id', helper.isAdmin, (req, res) => {
  let id = req.params.id;
  const deleted_at = helper.getDate()
  return new User({ id: id })
    .save({ deleted_at })
    .then(result => {
      console.log('deleted')
      res.redirect('/users')
    })
})



module.exports = router;