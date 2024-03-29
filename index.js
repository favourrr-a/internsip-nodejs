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
      const users = await UserModel.find().select({
        password: 0
      });
      res.json({responseCode: '030', responseMessage: 'records found', data: users});
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '004', responseMessage: 'Internal Server Error' });
    }
  });
  

app.get('/get_user_by_id/:_id', async (req, res) => {
    try {
      const id = req.params._id;
  
      const user = await UserModel.findOne({ _id:id });
  
      if (user) {
        res.json({responseCode: '042', responseMessage: 'User exists', data: user});
      } else {
  
        res.json({responseCode: '041', responseMessage: 'User does not exist'});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '040', responseMessage: 'Internal Server Error' });
    }
  });
  

app.get('/get_user_by_name/:username', async (req, res) => {
    try {
      const username = req.params.username;
  
      const user = await UserModel.findOne({ username });
  
      if (user) {
        res.json({responseCode: '008', responseMessage: 'User exists', data: user});
      } else {
  
        res.json({responseCode: '009', responseMessage: 'User does not exist'});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '010', responseMessage: 'Internal Server Error' });
    }
  });
  

app.get('/get_user_by_email/:email', async (req, res) => {
    try {
      const email = req.params.email;
  
      const user = await UserModel.findOne({ email });
  
      if (user) {
        res.json({responseCode: '012', responseMessage: 'User exists', data: user});
      } else {
  
        res.json({responseCode: '013', responseMessage: 'User does not exist'});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '014', responseMessage: 'Internal Server Error' });
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
          res.json({responseCode: '015', responseMessage: 'Log in successful'});
        }
      }
      else {
        res.json("User does not exist")
      }
     
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '016', responseMessage: 'Internal Server Error' });
    }
  });


// app.get('/get_oldest_user', (req, res) => {    
//         res.json(oldestUser); 
// });

app.post('/update_user', async (req, res) => {
    try {
      const id = req.body._id;
  
      // Use findByIdAndUpdate to update the user by _id
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true } // Set to true to return the updated document
      );
  
      if (updatedUser) {
        res.json({ responseCode: '017', responseMessage: 'User updated', data: updatedUser });
      } else {
        res.json({ responseCode: '018', responseMessage: 'No record found' });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '015', responseMessage: 'Internal Server Error' });
    }
  });
  

  app.delete('/delete_user', async (req, res) => {
    try {
      const id = req.body.id;
  
      const deletedUser = await UserModel.findByIdAndDelete(id);
  
      if (deletedUser) {
        res.json({ responseCode: '019', responseMessage: 'User deleted', data: deletedUser });
      } else {
        res.json({ responseCode: '020', responseMessage: 'No record found for deletion' });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ responseCode: '021', responseMessage: 'Internal Server Error' });
    }
  });

// app.post('/change_password', async (req, res) => {
//   try {
//      id = req.body._id;
//     const newPassword = req.body.password;

//     const updatedPassword = await UserModel.findByIdAndUpdate(
//       id,
//       { password: bcrypt.hashSync(newPassword, 8) },
//       { new: false }
//     );
    

//     if (updatedPassword) {
//       res.json({ responseCode: '017', responseMessage: 'Pasword updated'});
//     } else {
//       res.json({ responseCode: '018', responseMessage: 'No record found' });
//     }

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ responseCode: '015', responseMessage: 'Internal Server Error' });
//   }
// })

app.post('/change_password', async (req, res) => {
  try {
    const id = req.body._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    // Retrieve the user from the database
    const user = await UserModel.findById(id);

    // Validate old password
    const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);

    if (!isOldPasswordValid) {
      res.json({ responseCode: '019', responseMessage: 'Invalid old password' });
    }

    else{
      res.json({ responseCode: '017', responseMessage: 'Pasword updated'});
    }

    // Update the password if the old password is valid
    await UserModel.findByIdAndUpdate(
      id,
      { password: bcrypt.hashSync(newPassword, 8) },
      { new: false }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ responseCode: '015', responseMessage: 'Internal Server Error' });
  }
});

  

//start server
app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});