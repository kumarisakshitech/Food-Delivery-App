import mongoose from "mongoose";

 export const connectDB = async ()=>{
    (await mongoose.connect('mongodb+srv://GreatStack:12345@cluster0.3r033pj.mongodb.net/food-del')).isObjectIdOrHexString(()=>console.log("DB Connected"));
}