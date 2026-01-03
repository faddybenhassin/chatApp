import User from "../models/user.model";

export async function signup(req,res){
    const {email,username,password} = req.body
    if(!email || !username || !password){
        res.send("need all credentials");
    };
    if(password.length < 6){
        res.send("password must be at least 6 charachters");
    };
    const user = await User.findOne({email: email})
    if(user){
                
    }
};

export async function login(req,res){
    res.send("login");
    
};

export async function logout(req,res){
    res.send("logout");
};