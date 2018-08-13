const express = require('express');
const router = express.Router();
const Art = require('../models/Art');
// const _ = require('lodash')
const helper = require('./helper')

router.use(helper.isAuthenticated)

router.route('/')
  .get((req, res) => {
    return Art
      .fetchAll({
        withRelated: ['author']
      })
      .then(arts => {
        let userObj = arts.toJSON()
        if (!arts) {
          return res.json({ "message": "there is no art" })
        } else {
          let artsArr = arts.map(element => {           
            element.attributes.username = element.relations.author.attributes.username
            return element.attributes;
          })
          res.render('gallery/home', {
            arts: artsArr
          })
        }
      })
      .catch(err => {
        return res.json({ "message": err.message })
      })
  })
  .post((req, res) => {
    let { author, link, description } = req.body;
    link = link.replace(/\s/g, "");
    let author_id = req.user.id;
    let username = req.user.username;
    console.log('THIS IS USERNAME', username);
    if (!author || !link) {
      req.flash('linkmiss', 'Link or author missing!')
      return res.redirect('/arts/new')
    } else {
      return new Art({ author_id, link, description })
        .save()
        .then(post => {
          return res.redirect('/arts')
        })
        .catch(err => {
          return res.json({ "message": err.message })
        })
    }
  })

router.get('/new', (req, res) => {
  return res.render('gallery/new', {
    message: req.flash('linkmiss')
  })
})

router.route('/:id')
  .get((req, res) => {
    let id = req.params.id;
    return Art
      .query({ where: { id: id } })
      .fetchAll({
        withRelated: ['author']
      })
      .then(arts => {
        let artsInfo = arts.toJSON();

        let artsArr = arts.map(element => {
          return element.attributes;
        })
        if (!arts) {
          return res.status(404).json({ "message": "artwork does not exist" })
        } else {
          res.render('gallery/artwork', {
            arts: artsArr[0],
            err: req.flash('youDontOwn')
          })
        }
      })
      .catch(err => {
        res.json({ "message": err.message })
      })
  })
  .put((req, res) => {
    let id = req.params.id;
    let { author_id, link, description } = req.body
    return Art
      .query({ where: { id: id } })
      .fetchAll()
      .then(result => {
        if (req.user.id !== result.models[0].attributes.author_id && req.user.id !== 25) {
          req.flash('youDontOwn', 'You do not have rights to edit this post')
          return res.redirect(`/arts/${id}`)
        } else {
          return new Art({ id: id })
            .save({ author_id, link, description })
        }
      })
      .then(art => {
        if (!art) {
          res.status(404).json({ "message": "artwork does not exist" })
        } else {
          res.redirect(`/arts/${id}`)
        }
      })
      .catch(err => {
        return res.json({ "message": err.message })
      })


  })
  .delete((req, res) => {
    let id = req.params.id;
    return Art
      .query({ where: { id: id } })
      .fetchAll()
      .then(result => {
        if (req.user.id !== result.models[0].attributes.author_id && req.user.id !== 25) {
          req.flash('youDontOwn', 'You do not have rights to delete this post')
          return res.redirect(`/arts/${id}`)
        } else {
          return new Art({ id: id })
            .destroy()
            .then(result => {
              return res.redirect('/arts')
            })
            .catch(err => {
              return res.json({ "message": err.message })
            })
        }
      })
  })

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  return Art
    .query({ where: { id: id } })
    .fetchAll()
    .then(arts => {
      if (req.user.id === arts.models[0].attributes.author_id) {
        let artsArr = arts.map(element => {
          return element.attributes;
        })
        if (!arts) {
          res.status(404).json({ "message": "artwork not found" })
        } else {
          res.render('gallery/edit', {
            arts: artsArr[0]
          })
        }
      } else {
        req.flash('youDontOwn', 'You do not have rights to edit this post')
        res.redirect(`/arts/${id}`)
      }
    })
    .catch(err => {
      res.json({ "message": err.message })
    })
})




module.exports = router;