const express = require('express');
const bodyParser = require('body-parser'); //always import this when using psot
const app = express();
const port = 3001;

const users = require("./data");
const oldestUser = require("./oldestUser")

app.use(bodyParser.json());

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

app.get('/get_users', (req, res) => {

    res.json(users);
});


app.get('/get_user_by_id/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if(user){
        res.json(user); 
    }
    else{

        res.json('user does not exist')
    }
});

app.get('/get_user_by_name/:name', (req, res) => {
    const name = req.params.name;
    const user = users.find(user => user.name === name);
    if(user){
        res.json(user); 
    }
    else{

        res.json('user does not exist')
    }
});

app.get('/get_user_by_email/:email', (req, res) => {
    const email = (req.params.email);
    const user = users.find(user => user.email === email);
    if(user){
        res.json(user); 
    }
    else{

        res.json('user does not exist')
    }
});

app.get('/get_oldest_user', (req, res) => {    
        res.json(oldestUser); 
    

    
});

app.post('/login', (req,res) => {
    const email = req.body.email; //get params, post body
    const password = req.body.password;

    console.log(email, password);

    const user = users.find(user => user.email === email);
    if(user){
        if (password === user.password){
            res.json(user)
        }
        else{
            res.json("this password is incorrect")
        }
    }
    else{

        res.json('user does not exist')
    }


});




//start server
app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});