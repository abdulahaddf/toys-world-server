const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://abdulahaddf1:BpwyQcr841PRWoPQ@cluster0.wg0iu7v.mongodb.net/?retryWrites=true&w=majority";




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

        const toyCollection = client.db('toyDB').collection('toy');

        app.get('/toy', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        

        app.post('/toy', async (req, res) => {
            const newtoy = req.body;
            console.log(newtoy);
            const result = await toyCollection.insertOne(newtoy);
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



app.get('/', (req, res) => {
    res.send('toy making server is running')
})

app.listen(port, () => {
    console.log(`toy Server is running on port: ${port}`)
})