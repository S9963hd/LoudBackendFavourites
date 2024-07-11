let express=require('express');
let mongoose=require('mongoose');
let {model}=require('./Model');
let cors=require('cors');
let app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.post('/setfavourites',async(req,res)=>{
    console.log("data :: ",req.body);
    try{
            let favList=await model.findOne({email:req.body.email});
            if(favList && favList.songs.length!=0){
                        const songs = Array.isArray(req.body.songs) ? req.body.songs : [req.body.songs];
                        await model.findOneAndUpdate(
                            { email: req.body.email },
                            { $addToSet: { songs: { $each: songs } } }, // Using $addToSet with $each to add multiple items
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        );
                    }
            else{
                await model.findOneAndUpdate({email:req.body.email},{$push:{songs:req.body.songs}},{ upsert: true, new: true, setDefaultsOnInsert: true })
            }
            let data=await model.findOne({email:req.body.email});
            console.log(data);
            res.status(200).json(data.songs);
        }catch(err){
            console.log(err);
        res.sendStatus(500);
    }
})
app.post('/deletefavourites',async(req,res)=>{
    console.log("data :: ",req.body);
    try{
        let user=await model.findOne({email:req.body.email});
        console.log(user);
        if(user){
            await model.findOneAndUpdate({email:req.body.email},{$pull:{songs:req.body.songs}},{ upsert: true, new: true, setDefaultsOnInsert: true })
            res.sendStatus(200);
        }
        else{
            res.sendStatus(401);
        }
    }catch(err){
        res.sendStatus(500);
    }
    
})
app.post('/getfavourites',async(req,res)=>{
    console.log(req.body);
    try{
        let data=await model.findOne({email:req.body.email});
        (data)?res.status(200).json(data.songs):res.status(401).json([])
        console.log("Done");
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})
mongoose.connect("mongodb+srv://sanjaysoman46:sanjay123@frisson.1nliflp.mongodb.net/?retryWrites=true&w=majority&appName=frisson").then(()=>app.listen(8081,()=>console.log("Server Connection"))).catch(err=>console.log(err,"Error"))