const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






app.get('/', (req, res) => {
    res.send('toy making server is running')
})

app.listen(port, () => {
    console.log(`toy Server is running on port: ${port}`)
})