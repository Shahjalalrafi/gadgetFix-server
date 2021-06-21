const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fltsf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  
    const serviceCollection = client.db("gadgetFix").collection("services");
    // add services
  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new service ', newService);
    serviceCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

//   get all services
  app.get('/service', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database ', items);
    })
  })

  app.get('/serviceRequest', (req, res) => {
    serviceRequestCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database ', items);
    })
  })
  
  // booked new service
  const serviceRequestCollection = client.db("gadgetFix").collection("serviceRequest");
  app.post('/bookedService', (req, res) => {
    const newServiceRequest = req.body;
    console.log('booked new service', newServiceRequest);
    serviceRequestCollection.insertOne(newServiceRequest)
    .then(result => {
      console.log('insert count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
  
});


app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})