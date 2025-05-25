const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength : 4,
        trim :true,
        maxLength:25,
    },
    lastName:{
        type:String,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim :true

    },
    password:{
        type:String,
        required:true,

    },
    age:{
        type:Number,
        min:18,

    },
    gender:{
        type:String,
        validate(val){
            if (!["male","female","other"].includes(val)) {
                throw new Error("Gender data is not valid .");
                
            }
        }
    },
    photUrl:{
        type:String,
        defaultValue:"https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg"
    },
    about:{
        type:String,
        defaultValue:"This is default description of user",

    },
    skills:{
        type:[String],
    }

},{
    timestamps : true,
});

module.exports=mongoose.model("User",userSchema);