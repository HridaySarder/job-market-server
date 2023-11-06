const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gv4wyxg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const jobCollection = client.db('jobMarket').collection('jobs');
const addJobCollection = client.db('jobMarket').collection('addJobs');

app.get('/jobs', async(req,res) => {
  const cursor = jobCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.get("/jobDetails/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await jobCollection.findOne(query);
  res.send(result);
});

app.get('/addJobs', async(req,res) => {
  const cursor = addJobCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.post('/addJobs', async(req,res) => {
  const newJob = req.body;
  const result = await addJobCollection.insertOne(newJob)
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Online job server is running on port ${port}`);
})