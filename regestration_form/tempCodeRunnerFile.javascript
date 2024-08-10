const express = require("express");//is a framework to simplify the process of making application
const mongoose = require("mongoose");//library in interact with mongo database easily
const bodyParser = require("body-parser");//to make data from the client readable
const dotenv = require("dotenv");//to hide our passwords

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const password = process.env.MONGO_password;
mongoose.connect("mongodb+srv://uvaismalik2621:F0qlra2jW17vO79t@cluster0.ikxe5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser:true,
    useUnifieldTopology : true,
});

const registrationSchema = new mongoose.Scheme({
    name:String,
    email:String ,
    password : String
});

const Registration = mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})
app.post("/regester",(req,res)=>{
    try{
        const{name,email,password} = req.body;

        const registrationData  = new Registration ({
            name , email, password,
        });
        registraionData.save();
        res.redirect("/success");

    }
    catch(error){
        console.log(error);
        res.redirect("error");
        
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})