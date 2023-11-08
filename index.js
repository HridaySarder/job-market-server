const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gv4wyxg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const jobCollection = client.db("jobMarket").collection("jobs");
    const addJobCollection = client.db("jobMarket").collection("addJobs");

    app.get("/jobs", async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/jobDetails", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await addJobCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/addJobs", async (req, res) => {
      const cursor = addJobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/addJobs", async (req, res) => {
      const newJob = req.body;
      const result = await addJobCollection.insertOne(newJob);
      res.send(result);
    });

    app.patch("/addjobs/:id", async (req, res) => {
      const updatedJob = req.body;
    });

    app.delete("/addJobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addJobCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Online job server is running on port ${port}`);
});
