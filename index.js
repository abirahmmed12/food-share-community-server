const express = require('express');
const cors = require('cors');
const cookieperser = require('cookie-parser')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000



//middle ware
app.use(cors({
  
  
}));

app.use(express.json())
app.use(cookieperser())



//connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x8pzcmr.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const foodcollection =client.db('foodDonate').collection('items')
    const requestcollection = client.db('foodDonate').collection('request')

    // app.get('/addfood',async(req,res)=>{
    //   const cursor = foodcollection.find()
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })
    app.post('/addfood', async (req, res) => {
      const addfood = req.body;
      console.log(addfood);
    
      try {
        const result = await foodcollection.insertOne(addfood);
        res.json({ success: true, message: 'Food added successfully', result });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding food', error });
      }
    });

    //for dynamic rout
     app.get('/addfood/:id', async (req, res) => {
      const id = req.params.id;

      // try {
        const query = { _id: new ObjectId(id) };
        const product = await foodcollection.findOne(query);
        res.send(product)

    });

    //insertrequests
    app.post('/request', async (req, res) => {
      const requestData = req.body;
    
      try {
        // Insert the request data into the MongoDB collection
        const result = await requestcollection.insertOne(requestData);
    
        // Send a success response to the client
        res.status(200).json({ success: true, message: 'Request added successfully', result });
      } catch (error) {
        // Handle any errors and send an error response to the client
        res.status(500).json({ success: false, message: 'Error adding request', error: error.message });
      }
    });
    //get data
    app.get('/request', async (req, res) => {
      console.log(req.query.email);
      console.log(req.cookies); // If you're using cookies for authentication or session management
  
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
  
      try {
        const result = await requestcollection.find(query).toArray();
        res.json(result);
      } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.delete('/request/:id',async(req,res)=>{
      const id = req.params.id
      const query ={_id: new ObjectId(id)}
      const result = await requestcollection.deleteOne(query)
      res.send(result)
    })

    app.get('/requested',async(req,res)=>{
      let query ={}
      if(req.query?.
        donatorname){
        query={
          donatorname: req.query?.
          donatorname}
      }
      const result = await requestcollection.find(query).toArray()
      res.send(result)
    })

    app.get('/addfood',async(req,res)=>{
      let query ={}
      if(req.query?.email){
        query={donatorEmail: req.query?.email}
      }
      const result = await foodcollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/addfood/:id',async(req,res)=>{
      const id = req.params.id
      const query ={_id: new ObjectId(id)}
      const result = await foodcollection.deleteOne(query)
      res.send(result)
    })

    //auth related
    // app.post('/jwt', async (req, res) => {
    //   const user = req.body;
    //   console.log('user', user);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    //   res.cookie('token',token,{
    //     httpOnly: true,
    //     secure: true,
    //     sameSite:'none'
    //   })
    //   res.send({success:true });
    // });

    // app.post('/logout',async(req,res)=>{
    //   const user = req.body
    //   res.clearCookie('token',{maxAge:0}).send({success:ture})
    // console.log(user)
    // })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('food is donationg')
})
app.listen(port,()=>{
    console.log(`food donation server is runnig on port${port}`)
})