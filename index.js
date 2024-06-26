const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const propertyCollection = client
      .db("Heritage_Nest")
      .collection("property");
    const testimonialCollection = client
      .db("Heritage_Nest")
      .collection("testimonial");

    //property
    app.post("/property", async (req, res) => {
      try {
        const result = req.body;
        result.createdAt = new Date();
        const data = await propertyCollection.insertOne(result);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: "Failed to create property" });
      }
    });

    app.get("/property", async (req, res) => {
      try {
        const result = await propertyCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch properties" });
      }
    });

    app.get("/property/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await propertyCollection.findOne(query);
      res.send(result);
    });

    app.get("/recent-property", async (req, res) => {
      try {
        const result = await propertyCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch recent properties" });
      }
    });

    // testimonial
    app.post("/testimonial", async (req, res) => {
      try {
        const result = req.body;
        const data = await testimonialCollection.insertOne(result);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: "Failed to create testimonial" });
      }
    });

    app.get("/testimonial", async (req, res) => {
      try {
        const result = await testimonialCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch testimonials" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
