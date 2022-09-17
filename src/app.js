const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: false }));

// Database Connection setup
const db = require('./db/conn');

// Models Connection Setup
const schema = require('./models/schema');

// Hbs Or Partials Connection
const path = require('path');
const staticPath = path.join(__dirname,'../public/');
const viewsPath = path.join(__dirname,'../templates/views/');
const partialsPath = path.join(__dirname,'../templates/partials/');

const hbs = require('hbs');
app.use(express.static(staticPath));
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

// ------------------------------API Call--------------------------------
app.get('/',(req,res)=>{
    try {
        res.render('index')
    } catch (error) {
        console.log(error);
        res.send('Something went wrong');
    }
});

// Server Listen Or Call
app.listen(port,()=>{
    console.log(`server started at port number ${port}`);
});