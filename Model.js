let mongoose=require("mongoose");
let Schema = new mongoose.Schema({
    email:{type:String},
    songs:{type:Array}
})
let model=mongoose.model("favourite",Schema);
module.exports={model};