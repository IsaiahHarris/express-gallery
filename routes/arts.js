const express = require('express');
const router = express.Router();
const Art = require('../models/Art');

router.route('/')
  .get((req, res) => {
    return Art
      .fetchAll()
      .then(arts => {
        if (!arts) {
          return res.json({ "message": "there is no art" })
        } else {
          return res.json(arts)
        }
      })
      .catch(err => {
        return res.json({ "message": err.message })
      })
  })
  .post((req, res) => {
    let { author, link, description } = req.body;
    link = link.toLowerCase();
    return new Art({ author, link, description })
      .save()
      .then(post => {
        return res.json(post)
      })
      .catch(err => {
        return res.json({ "message": err.message })
      })
  })

router.get('/new', (req, res) => {
  res.send('newpage')
})

router.route('/:id')
  .get((req, res) => {
    let id = req.params.id;
    return Art
      .query({ where: { id: id } })
      .fetchAll()
      .then(arts => {
        if (!arts) {
          return res.status(404).json({ "message": "artwork does not exist" })
        } else {
          res.json(arts)
        }
      })
      .catch(err => {
        res.json({ "message": err.message })
      })
  })
  .put((req, res) => {
    let id = req.params.id;
    let { author, link, description } = req.body
    return new Art({ id: id })
      .save({ author, link, description })
      .then(arts => {
        if (!arts) {
          res.status(404).json({ "message": "artwork does not exist" })
        } else {
          res.json(arts)
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
        res.send('has been deleted')
      })
      .catch(err => {
        res.send('there has been an error')
      })
  })




module.exports = router;