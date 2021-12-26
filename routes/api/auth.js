const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const {check, validationResult} = require('express-validator');
const config = require('config'); 
const bcrypt = require('bcryptjs');


//@route    GET api/auth
//@desc     Test Route
//@access   Public
router.get('/',auth, async(req,res)=> {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

//@route    Post api/auth
 //@desc     Auth user and et token
 //@access   Public
 router.post('/',[
    check('email','Please use valid email').isEmail(),
    check('password','Password is required!').exists()
],
async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()});
    }

    const {email, password } = req.body;

    try {
       //See if user exits
       let user = await User.findOne({email});
       if (!user) {
          return res.status(400).json({errors: [{ msg:"Invalid credentials" }] });
       }


       const isMatch = await bcrypt.compare(password,user.password);

       if (!isMatch) {
        return res.status(400).json({errors: [{ msg:"Invalid credentials" }] });
       }
       
       //Return Jsonwebtoken
       const payload = {
           user:{
               id:user.id
           }
       } 

       jwt.sign(
           payload,
           config.get('jwtSecret'),
           { expiresIn:360000},
           (err,token)=>{
               if(err) throw err;
               res.json({token});
           });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

    

   });

module.exports= router;