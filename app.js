const express= require("express");
const app=express();

app.get("/hello",(req,res)=>{
    res.send("second hello")
})
app.use("/",(req,res)=>{
    res.send("hello there")
  
})



const PORT=3000;
app.listen(PORT,()=>{
    console.log("Server is running on http://localhost:3000");
    
})