const Users = require("../model/users");
const bcrypt = require('bcrypt');
const dotenv=require('dotenv');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto')
 dotenv.config();

exports.register = async (req, res) => {
    let {
        email,
        username,
        password,
        firstname,
        lastname,
    } = req.body;

    if (!username || !email || !password || !firstname || !lastname) {
        res.send("all fields are required");
    }

    const valid = await Users.findOne({
        $or: [{ email }, { username }],
    })

    if (valid) {
        res.send('user is alerady exist')
        return
    }

    const hashpassword = await bcrypt.hash(password, 10);
    password = hashpassword;
    const data = new Users({
        email,
        username,
        password,
        firstname,
        lastname,
    })
    await data.save();
    res.send("user craeted sucessfully");
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
     

        const user = await Users.findOne({ email });

        if (!user) {
            res.send("user is not exist")
            return
        }
   
        const loged = await bcrypt.compare(password, user.password)
        const token = jwt.sign({user}, process.env.SECRET_KEY, {
            expiresIn:'1h',
        });
        if (loged) {
            res.send({
                username:user.username,
                token: token,
                message: 'user login sucessfully'
            });
        } else {
            res.send('login failed')
        }
    } catch (error) {
        res.send(error);
    }
}




exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await Users.findOne({ email:email });
    // console.log(user,"before ");
    if (!user) {
      return res.status(404).send('User not found');
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10*60*1000; 
    await user.save();
    
    // console.log(user)


    const resetUrl = `http://localhost:3000/resetPassword/${token}`
    const mailOptions = {
      to: email,
      from:process.env.MY_GMAIL,
      subject: 'Password Reset Request',
      text: `Please click the link to reset your password: ${resetUrl}`
    };
    // console.log(mailOptions)
    // console.log(process.env.MY_GMAIL);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user:process.env.MY_GMAIL,
          pass:process.env.MY_GMAIL_PASSWORD
        }
      });
      // console.log('hii')
      // console.log(process.env.MY_GMAIL)
      // console.log(process.env.MY_GMAIL_PASSWORD)
     console.log("hii i am upper of sendmail")
     console.log()
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Password reset email sent');
    });
  };

  exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    const user = await Users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
  
    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired');
    }
     const hashpassword=await bcrypt.hash(newPassword,10);
    user.password =hashpassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).send('Your password has been reset successfully');
  };


