const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 8080

app.use(bodyParser.urlencoded({extended:true}));
app.use('/', routes);

app.get('/', (req,res)=>{
  res.send('got')
})

app.listen(PORT, ()=>{
  console.log(`listening to port ${PORT}`)
})