import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {typr:String,required:true},
    description:{type:String,required:true}
})