require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 8008;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bbm4h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("ecomerce").collection("products");
  const orderCollection = client.db("ecomerce").collection("orders");
  app.post("/addProducts", (req, res) => {
    const product = req.body;
    collection.insertMany(product).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
    console.log(product);
  });

  app.get("/products", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    collection.find({key: req.params.key}).toArray((err, documents) => {
      res.send(documents[0])
    });
  });
  app.post('/productsByKeys', (req, res) => {
    const productsKeys = req.body;
    collection.find({key: {$in : productsKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    orderCollection.insertOne(order)
    .then((result) => {
      console.log(result.insertedCount);
      res.status(200).send(result.insertedCount);
    });
  });
  // perform actions on the collection object
  //   client.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
