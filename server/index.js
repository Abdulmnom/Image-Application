const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const authRoute = require('./route/index');
const imageRoutes = require('./route/images');


// seting
app.use(cors());
app.use(express.json());
require('dotenv').config();
// static folder
app.use('/uploads',express.static('uploads'));



// mongoose connect
mongoose.connect('mongodb://localhost:27017/Image-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));



// routes
app.get('/', (req,res)=>{
    res.send('test the API');
});
app.use('/api/images', imageRoutes);
app.use('/api/auth' , authRoute);
// app listen 
app.listen(PORT , ()=> {
    console.log(`Server is running on port ${PORT}`);
})