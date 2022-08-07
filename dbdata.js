import mongoose from "mongoose";
const data1=mongoose.Schema({
    user:String,
    message:String,
    Time:String,
    recieved:Boolean
  
    
})
export default mongoose.model("messagecontents",data1);