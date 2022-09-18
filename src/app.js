const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

// Database Connection setup
const db = require('./db/conn');

// Bcrypting
const bcrypt = require("bcryptjs");

// Models Connection Setup
const user = require('./models/user');
const contact = require('./models/contact');
const blog = require('./models/blog');
const post = require('./models/post');

// Hbs Or Partials Connection
const path = require('path');
const staticPath = path.join(__dirname,'../public/');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

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

// Contact us POST method
app.post('/', async (req,res)=>{
    try {
        const newContact = new contact({
            name:req.body.name,
            email:req.body.email,
            message:req.body.message
        });
        const result = await newContact.save();
        res.render('index');
    } catch (error) {
        res.send(error);
    }
});

// Register A New User
app.get('/register', async (req,res)=>{
  try {
    res.status(200).render('register');
  } catch (error) {
    res.send(error);
  }
});
app.post('/register', async (req,res)=>{
    try {
        const data = new user({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });
        const result = await data.save();
        res.status(200).render('login');
    } catch (error) {
        res.send(error);
    }
});

// Login 
app.get('/login', async (req,res)=>{
  try {
    res.status(200).render('login');
  } catch (error) {
    res.send(error);
  }
});
app.post("/login", async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const check = await user.findOne({ email: email });
      if (check) {
        const userpassword = check.password;
        const isMatch = await bcrypt.compare(password, userpassword);
        const name = check.name;
        const blogName = await blog.find({email:email});
        if (isMatch === true) {
          res.status(200).render('viewUser',{
            email:req.body.email,
            userName:name,
            url:req.url,
            title:blogName
          });
        } else {
          res.send("password incorrect");
        }
      } else {
        res.send("Invalid Email");
      }
    } catch (error) {
      res.status(404).send("Something Went Wrong");
      console.log(error);
    }
  });

// Create blog
app.post('/addblog', async (req,res)=>{
  try {
    const data = new blog({
      title:req.body.title,
      email:req.body.email
    });
    const result = await data.save();
    res.status(200).render('blog',{
      docs:result
    });
  } catch (error) {
    res.send(error);
  }
});

// -----------------Middleware-----------------------------
// Middleware
const multer = require('multer');
const Storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'./public/file');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname+"_"+Date.now() + "--"+path.extname(file.originalname));
  },
});
var upload = multer({ 
  storage: Storage 
}).single('file');


// Create Post For Blog
app.get('/createpost',async (req,res)=>{
  try {
    res.status(200).render('createPost');
  } catch (error) {
    res.send('Something went wrong');
  }
})
app.post('/createpost', upload,async(req,res,next)=>{
  try {
    const today = new Date();
    const day = today.getDate();        
    const month = today.getMonth();
    const newMonth = (month+1);     
    const year = today.getFullYear(); 
    const currentDate = (day+"/"+newMonth+"/"+year);
    const data = new post({
      heading:req.body.name,
      image:req.file.filename,
      description:req.body.description,
      date:currentDate
    });
    const result = await data.save();
    res.render('blog',{
      docs:result
    });
  } catch (error) {
    res.send(error);
  }
});

// Single Blog
app.get('/:name',async(req,res)=>{
  try {
    const name = req.params.name;
    const data = await blog.findOne({title:name});
    res.status(200).render('blog',{
      docs:data
    });
  } catch (error) {
    res.send(error);
  }
});

// Server Listen Or Call
app.listen(port,()=>{
    console.log(`server started at port number ${port}`);
});