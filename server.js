const express = require('express');
const app = express();
const port = process.env.PORT || 9000
const bodyParser = require('body-parser');
var cors = require('cors');
const tibco = require('./tibco.js');

const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors());
app.use('/v1', tibco);
app.get('/', (req, res) => res.send('Hello World!'))

const url = "mongodb+srv://apandey26:apandey26@ashish-i6w8s.mongodb.net/test?retryWrites=true&w=majority";
const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
MongoClient.connect(url, options, (err, database) => {
    if (err) {
      console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`)
      process.exit(1)
    }
    app.locals.db = database.db('cegoogler')
    app.listen(port, () => console.log(`Example app listening on port- `+port))
  })

