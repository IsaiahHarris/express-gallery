const express = require('express');
const router = express.Router();
const Art = require('../models/Art');

router.route('/')
.get((req,res)=>{
  return Art
  .fetchAll()
  .then(result=>{
    if(!result || !result.rowCount){
      res.send('there are no posts')
    }
    return result;
  })
  .then(arts=>{
    return res.json(arts)
  })
  .catch(err=>{
    return res.json({"message": err.message})
  })
})
.post((req,res)=>{
  let { author, link, description } = req.body;
  link = link.toLowerCase();
  return new Art({ author, link, description})
  .save()
  .then(post=>{
    return res.json(post)
  })
  .catch(err=>{
    return res.json({"message": err.message})
  })
})

module.exports = router;