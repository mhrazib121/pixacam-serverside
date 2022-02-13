const { MongoClient, ObjectId } = require('mongodb');
const express =require('express');
const cors = require('cors');
const res = require('express/lib/response');
const app = express();
app.use(cors())
app.use(express.json());
require('dotenv').config()

const port = process.env.PORT || 5001;
// 13uBVpLgWEgFQRiv

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvulc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



async function run(){
    try{
        await client.connect();
        const database = client.db('pixacam');
        const allProductCollection = database.collection("allProduct");
        const allOrderCollection = database.collection("allOrder");

        // Product 
        app.get('/products', async(req, res)=>{
            const cursor = allProductCollection.find({});
            const product = await cursor.toArray();
            res.send(product);
        })

        // Product post in server 

        app.post('/products', async(req, res)=>{
            const product =req.body;
            const result = await allProductCollection.insertOne(product);
            res.send(result)
        })

        // Order post in Database 
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await allOrderCollection.insertOne(order);
            res.json(result);
        })

        // get order details from database 

        app.get('/orders', async(req,res)=>{
            const cursor = allOrderCollection.find({});
            const order = await cursor.toArray();
            res.send(order)
        })

        // Delete Order 

        app.delete('/orders/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await allOrderCollection.deleteOne(query);
            res.json(result);
        })

        app.put('/orders/:id', async (req, res)=>{
            const id = req.params.id;
            const updateOrderStartus =req.body;
            const filter ={_id: ObjectId(id)};
            const options ={upsert: true}
            const updateDoc ={
                $set:{
                    status: updateOrderStartus.status
                }
            };
            const result = await allOrderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('Hellow World')
})

app.listen(port,()=>{
    console.log('connected')
})