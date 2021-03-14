const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const authRoutes = require('./routes/auth');
const endPoints = require('./routes/endpoints');
const port = 5000 || process.env.port;


app.use(
    bodyParser.urlencoded({
        extended : false
    })
);
app.use(bodyParser.json());


mongoose.connect(
    'mongodb://127.0.0.1:27017/attManager',
    {useNewUrlParser : true , useUnifiedTopology : true}
)
.then(()=> console.log('Connected successfully with MongoDB..'))
.catch(err => console.log(err));


app.use(passport.initialize());
require("./passport")(passport);


app.use('/auth',authRoutes);
app.use('/user',endPoints);
app.get('/test' , (req,res)=>{
    res.json({name : 'naveen',age: 20});
})

app.listen(port , ()=>{
    console.log(`server is running on port ${port}`)
})