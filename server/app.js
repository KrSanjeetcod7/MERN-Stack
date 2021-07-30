const express = require('express');
const app = express();
const dotenv = require('dotenv');


dotenv.config({path: './config.env'});
require('./db/conn');
const User = require('./models/userSchema');

app.use(express.json());

// we link the router files to make our route easy
app.use(require('./router/auth'));

const PORT = process.env.PORT;


const middleware = (req, res, next) =>{
    console.log("Hello Middleware");
    next();
}
// middleware();

// app.get('/',(req, res) =>{
//     res.send("Hello World app.js");
// });
// app.get('/about', middleware,(req, res) =>{
//     console.log("Hello my middleware");
//     res.send("Hello About");
// });
// app.get('/contact',(req, res) =>{
//     res.send("Hello Contact");
// });
// app.get('/signin',(req, res) =>{
//     res.send("Hello signin");
// });
app.get('/contact',(req, res) =>{
    res.cookie("sanj", 'test');
    res.send("Hello signup");
});

app.listen(PORT, () =>{
    console.log(`Server is running at port no ${PORT}`);
});