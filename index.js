const express = require('express');
const bodyParser = require('body-parser'); //always import this when using post
const app = express();
const port = 3001;
const mongoose = require('mongoose'); 
const UserModel = require('./models/userModel');
var bcrypt = require("bcryptjs"); //for encrypting passwords

// const users = require("./data");
// const oldestUser = require("./oldestUser")

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// HTTP VERBS
// GET, POST, PUT, DELETE

//Define a gET request

app.get('/', (req, res) => {
    res.json("Hello World!");
});

//working with query params
// app.get('/:name', (req, res) => {
//     console.log(req.params)
//     const name = req.params.name
//     res.send(`Hello ${name}`);
// });


app.post('/register', async (req, res) => {
    try {
      const { email, username, age, password } = req.body;
  
      const existingUser = await UserModel.findOne({ email });
  
      if (existingUser) {
        res.json({responseCode: '001', responseMessage: 'Email already exists'});
      } else {
        const newUser = new UserModel({ email, username, age, password: bcrypt.hashSync(password, 8) });
        await newUser.save();
  
        res.json({responseCode: '000', responseMessage: 'Sign up successful! Please login with your details'});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '500', responseMessage: 'Internal Server Error' });
    }
  });
  

  app.get('/get_users', async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json({responseCode: '005', responseMessage: 'records found', data: users});
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '006', responseMessage: 'Internal Server Error' });
    }
  });
  

app.get('/get_user_by_id/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if(user){
        res.json(data: user); 
    }
    else{

        res.json({responseCode: '001', responseMessage: 'user does not exist'})
    }
});

app.get('/get_user_by_name/:name', (req, res) => {
    const name = req.params.name;
    const user = users.find(user => user.name === name);
    if(user){
        res.json(user); 
    }
    else{

        res.json({responseCode: '001', responseMessage: 'user does not exist'})
    }
});

app.get('/get_user_by_email/:email', (req, res) => {
    const email = (req.params.email);
    const user = users.find(user => user.email === email);
    if(user){
        res.json(user); 
    }
    else{

        res.json({responseCode: '001', responseMessage: 'user does not exist'})
    }
});


app.post('/login', async (req, res) => {
    try {
      const email = req.body.email;
  
      console.log(req.body);
  
      const user = await UserModel.findOne({ email });
      if(user){
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }else{
          res.json({responseCode: '001', responseMessage: 'Log in successful'});
        }
      }
      else {
        res.json("User does not exist")
      }
     
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '001', responseMessage: 'Internal Server Error' });
    }
  });

// app.get('/get_oldest_user', (req, res) => {    
//         res.json(oldestUser); 
// });


//start server
app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});