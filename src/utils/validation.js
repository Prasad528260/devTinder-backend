const validator=require("validator");

const signUpValidation=(req)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Please enter valid name");
        
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email id not valid");
        
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be strong");
        
    }
}
module.exports={
    signUpValidation
}