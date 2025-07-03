const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoute = require('./route/index');
const imageRoutes = require('./route/images');


// seting
app.use(cors());
app.use(express.json());
app.use('/api/auth' , authRoute);


// mongoose connect
mongoose.connect('mongodb://localhost:27017/gallery-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));



// routes
app.use('/', (req,res)=>{
    res.send('hello world');
});


// app listen 
app.listen(PORT , ()=> {
    console.log(`Server is running on port ${PORT}`);
})