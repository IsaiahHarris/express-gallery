const express = require('express');
const router = express.Router();
const Art = require('../models/Art');

router.route('/')
.get((req,res)=>{
  return Art
  .fetchAll()
  .then(arts=>{
    return res.json(arts)
  })
  .catch(err=>{
    return res.json({"message": err.message})
  })
})
.post((req,res)=>{
  let { author, link, description } = req.body;

})

module.exports = router;