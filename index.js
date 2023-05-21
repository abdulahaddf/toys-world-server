const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wg0iu7v.mongodb.net/?retryWrites=true&w=majority`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
         client.connect((err) => {
            if (err) {
                console.error(err);
                return;
            }
         })

        const toyCollection = client.db('toyDB').collection('toy');

        app.get('/toy', async (req, res) => {
           
            const result = await toyCollection.find().sort({createAt : -1}).limit(20).toArray();
            res.send(result);
        })

        app.get("/toy/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        
                   
        app.get("/mytoys", async (req, res) => {
            // console.log(req.query.sellerEmail);
            let query = {}
            if(req.query?.sellerEmail){
                query = {sellerEmail: req.query.sellerEmail}
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result);
          });


          app.get("/toysCategory/:category", async (req, res) => {
            console.log(req.params.id);
            const result = await toyCollection
              .find({
                subCategory: req.params.category,
              }).limit(6)
              .toArray();
            res.send(result);
          });

          app.post('/toy', async (req, res) => {
            const newtoy = req.body;
            newtoy.createAt = new Date();
            console.log(newtoy);
            const result = await toyCollection.insertOne(newtoy);
            res.send(result);
        })

       
          app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })





        app.put("/updateToy/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            console.log(body);
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
              $set: {
                photo: body.photo,
                sellerName: body.sellerName,
                subCategory: body.subCategory,
                price: body.price,
                rating: body.rating,
                quantity: body.quantity,
                description: body.description,
              },
            };
            console.log(updateDoc);
            const result = await toyCollection.updateOne(filter, updateDoc);
            res.send(result);
          });
       






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
    res.send('toy server is running')
})

app.listen(port, () => {
    console.log(`toy Server is running on port: ${port}`)
})