const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();    
const nodemailer = require('nodemailer');
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })

let messageData = {};

// router.use(cookieParser());
// Validation middleware
const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('cpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];


router.get("/profile", async (req, res) => {
    try {
        const token = req.cookies.areeb_jwt;
        if (!token) {
            return res.status(400).json({ msg: "Token not found:Login First" });

        }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!verifyToken) {
            return res.status(401).json({ msg: "Token not verified" })
        }
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) {
            return res.status(404).json({ msg: "User not find" })

        }
        req.token = token;
        res.send(rootUser)
    } catch (error) {
        console.log(error);
    }
})

router.get("/getcontact", async (req, res) => {
    try {
        const token = req.cookies.areeb_jwt;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.send(rootUser);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});



// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please fill all the data' });
        }

        const userLogin = await User.findOne({ email });
        if (!userLogin) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credential' });
        }

        const token = await userLogin.generateAuthToken();
        res.cookie('areeb_jwt', token, {
            expires: new Date(Date.now() + 60000000),
            httpOnly: true
        });
        return res.status(200).json({ message: 'User signed in successfully', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/logout',(req,res)=>{
  let userLogout = res.clearCookie( "areeb_jwt" , {path:"/"})
  if(!userLogout){
    res.status(400).json({msg:"User is not logged in..."})
  }
  else{
    res.status(200).json({msg:"User logged out successfully"});
  }
})

router.post('/register', validateRegister, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, cpassword } = req.body;
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(422).json({ msg: 'User already exists' });
        } else if (!name || !email || !password || !cpassword) {
            return res.status(400).json({ msg: "Fill the form correctly" })
        }

        const user = new User({ name, email, password, cpassword });
        const registerUser = await user.save();
        if (registerUser) {
            res.status(201).json({ msg: "User registered successfully" })
        }else {
            res.status(500).json({ msg: 'Error registering user' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Server error' });
    }
});

router.post("/contact", async (req, res) => {
    try {
      const token = req.cookies.areeb_jwt;
      if (!token) {
        return res.status(400).json({ msg: "Token not found: Login First" });
      }
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      if (!verifyToken) {
        return res.status(401).json({ msg: "Token not verified" });
      }
      const rootUser = await User.findOne({
        _id: verifyToken._id,
        "tokens.token": token,
      });
      if (!rootUser) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      req.token = token;
  
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.json({ error: "Please fill the contact form." });
      }
  
      const userContact = await User.findOne({ _id: rootUser._id });
      if (userContact) {
        const userMessage = await userContact.addMessage(name, email, message);
        await userContact.save();
  
        // Nodemailer transporter configuration
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  
        const mailOptions = {
          from: email,
          to: process.env.EMAIL_USER, // Send to user's email
          subject: "Contact Form Message",
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(500).send("Error sending email");
          } else {
            return res.status(201).json({ msg: "Message sent successfully" });
          }
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  


module.exports = router;
