const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

require('../db/conn');
const User = require('../models/userSchema');

router.get('/',(req, res) =>{
    res.send("Hello World");
});

// using promises in javascript
// router.post('/register',  (req, res) =>{
//     const{name, email, phone, work , password, cpassword} = req.body; 
    // console.log(name);
    // console.log(email);
    // res.json({message: req.body});
    // res.send("register page");
//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error: "Plz fill the data properly"});
//     }

//     User.findOne({email:email})
//     .then((userExist) =>{
//       if(userExist){
//            return res.status(422).json({error: "email already exist"});
//       }
//       const user = new User({name ,email, phone, work, password, cpassword});
//       user.save().then(() =>{
//           res.status(201).json({message: "user registered successfully"});
//       }).catch((err) => res.status(500).json({error: "not registered"}));

//     }).catch(err => { console.log(err); });
// });
// using async await in javascript
router.post('/register',  async (req, res) =>{
    const{name, email, phone, work , password, cpassword} = req.body; 
    // console.log(name);
    // console.log(email);
    // res.json({message: req.body});
    // res.send("register page");
    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "Plz fill the data properly"});
    }
    try {     
      const userExist = await User.findOne({email:email});
       if(userExist){
           return res.status(422).json({error: "email already exist"});
      }else if(password != cpassword){
          return res.status(422).json({error: "password are not match"});
      }else{
          const user = new User({name ,email, phone, work, password, cpassword});

          await user.save();
    //   console.log(`${user} registered succussfully`);
    //   console.log(userRegister);
          res.status(201).json({message: "user registered successfully"});

      }
      

    //   if(userRegistered){
         
    //   }else{
    //       res.status(500).json({error: "not registered"});
    //   }
        
    } catch (err) {
         console.log(err);
    }

});

router.post('/signin', async (req, res) =>{
    // console.log(req.body);
    // res.json({message: "logged in"});
    try {
        const {email, password} = req.body;
        if(!email ||  !password){
            return res.status(400).json({error: "plz fill the required fields"});
        }
        const userLogin = await User.findOne({email: email});
        // console.log(userLogin);
        if(userLogin){
           const isMatch = await bcrypt.compare(password, userLogin.password);

           const token = await userLogin.generateAuthtoken();
           console.log(token);
           res.cookie('mycookie', token, {
               expires: new Date(Date.now() + 25892000000),
               httpOnly:true
           });

        if(!isMatch){
           res.status(400).json({error: "invalid credentials pass"});
        }else{
             res.status(201).json({message: "user signin successfully"});  
        }
        }else{
            res.status(400).json({error: "invalid credentials"});
        }
        
    } catch (error) {
        console.log(err);
    }
});
router.get('/about', authenticate, (req, res) =>{
    console.log("Hello about");
    res.send(req.rootUser);
});

router.get('/getdata', authenticate, (req, res) =>{
    console.log("Hello Contact");
    res.send(req.rootUser);
});

router.post('/contact', authenticate, async (req, res) =>{
    try {
        const {name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message){
            console.log(error);
            return res.status(400).json({error: "plz fill the contact form"});
        }
        const userContact = await User.findOne({_id: req.userID});
        if(userContact){
            const userMessage = await userContact.addMessage(name, email, phone, message);
            await userContact.save();
            res.status(201).json({message: "message sent succussfully.."});
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/logout', (req, res) =>{
    console.log("Hello logout");
    res.clearCookie('mycookie',  {path: '/login'});
    res.status(200).send('User Logout');
});

module.exports = router;