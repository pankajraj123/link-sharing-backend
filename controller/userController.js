const Users = require("../model/users");
const bcrypt=require('bcrypt');

exports.register = async (req, res) => {
    let { 
        email, 
        username,
        password,                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        firstname,
        lastname, 
        }=req.body;
        
        if(!username || !email || !password || !firstname || !lastname ){
          res.send("all fields are required");
        }
        
        const valid=await Users.findOne({$or:[{email},{username}],
        })

        if(valid){
            res.send('user is alerady exist')
            return 
        }
      
    const hashpassword= await bcrypt.hash(password,10);
    password=hashpassword;
    const data=new Users({
        email, 
        username,
        password,
        firstname,
        lastname, 
    })
    await data.save();
    res.send("user craeted sucessfully");
}

exports.login= async (req,res)=>{
   try{
    const {email,password}=req.body;
    
    const user=await Users.findOne({email});
    console.log(user)

     if(!user){
        res.send("user is not exist")
        return 
     } 
     const loged= await bcrypt.compare(password,user.password)
     if(loged){
        res.send('user login sucessfully');
     }else{
        res.send('login failed')
    }
   }catch(error){
    res.send(error);
   }
}



