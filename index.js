const { MongoClient, ObjectId } = require('mongodb');
const express =require('express');
const cors = require('cors');
const res = require('express/lib/response');
const app = express();
app.use(cors())
app.use(express.json());
require('dotenv').config()

const port = process.env.PORT || 5001;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvulc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db('pixacam');
        const allProductCollection = database.collection("allProduct");
        const allOrderCollection = database.collection("allOrder");
        const allReviewCollection = database.collection("allReview");
        const allUserCollection = database.collection("allUser");
        const productsCardCollection = database.collection("productsCard");

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

        // review post in database
        app.post('/reviews', async(req, res)=>{
            const reviews = req.body;
            const result = await allReviewCollection.insertOne(reviews);
            res.json(result);
        })

        // reviews get from database
        app.get('/reviews', async(req, res)=>{
            const cursor = allReviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        })

        // user post in database
        app.post ('/users', async(req, res)=>{
            const users = req.body;
            const result = await allUserCollection.insertOne(users);
            res.json(result);
        })

        // users get from database
        app.get('/users', async(req, res)=>{
            const cursor = allUserCollection.find({});
            const user = await cursor.toArray();
            res.send(user)
        })

        // details of added card post in database  
        app.post('/productscard', async(req, res)=>{
            const productsCard = req.body;
            const result = await productsCardCollection.insertOne(productsCard);
            res.json(result);
        })

        // details of get card post from database 
        app.get('/productscard', async(req, res)=>{
            const cursor = productsCardCollection.find({});
            const productincard = await cursor.toArray();
            res.send(productincard);
        })

        // Admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { email: email };
            const user = await allUserCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await allUserCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await allUserCollection.updateOne(filter, updateDoc);
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
    console.log('connected from server')
})