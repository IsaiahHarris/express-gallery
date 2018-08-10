const express = require('express');
const router = express.Router();
const Art = require('../models/Art');
// const _ = require('lodash')
const helper = require('./helper')

router.use(helper.isAuthenticated)

router.route('/')
  .get((req, res) => {
    return Art
      .fetchAll()
      .then(arts => {
        // console.log(arts.models[0].attributes)
        let artsArr = arts.map(element => {
          return element.attributes;
        })
        console.log(artsArr)
        if (!arts) {
          return res.json({ "message": "there is no art" })
        } else {
          res.render('gallery/home', {
            arts: artsArr
          })
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ "message": 'heyyy' })
      })
  })
  .post((req, res) => {
    console.log('REQ.USER.ID',req.user.id);
    let { author, link, description } = req.body;
    let author_id = req.user.id;
    link = link.toLowerCase();
    return new Art({ author_id, link, description, author })
      .save()
      .then(post => {
        return res.redirect('/arts')
      })
      .catch(err => {
        return res.json({ "message": err.message })
      })
  })

router.get('/new', (req, res) => {
  res.render('gallery/new')
})

router.route('/:id')
  .get((req, res) => {
    let id = req.params.id;
    return Art
      .query({ where: { id: id } })
      .fetchAll()
      .then(arts => {
        let artsArr = arts.map(element => {
          return element.attributes;
        })
        if (!arts) {
          return res.status(404).json({ "message": "artwork does not exist" })
        } else {
          res.render('gallery/artwork', {
            arts: artsArr[0]
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
    return new Art({ id: id })
      .save({ author_id, link, description })
      .then(arts => {
        if (!arts) {
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
    return new Art({ id: id })
      .destroy()
      .then(result => {
        res.redirect('/arts')
      })
      .catch(err => {
        res.send('there has been an error')
      })
  })

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  return Art
    .query({ where: { id: id } })
    .fetchAll()
    .then(arts => {

      let artsArr = arts.map(element => {
        return element.attributes;
      })
      // console.log(artsArr[0])
      if (!arts) {
        res.status(404).json({ "message": "artwork not found" })
      } else {
        res.render('gallery/edit', {
          arts: artsArr[0]
        })
      }
    })
    .catch(err => {
      res.json({ "message": err.message })
    })
})




module.exports = router;