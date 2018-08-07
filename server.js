const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 8080
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))

app.set('view engine', '.hbs');

app.use('/', routes);

app.get('/', (req,res)=>{
  res.send('got')
})

app.listen(PORT, ()=>{
  console.log(`listening to port ${PORT}`)
})