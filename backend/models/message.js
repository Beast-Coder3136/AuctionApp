import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  content  : {
    type : String ,
    required : true 
  },
  sender : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User" 
  },
  auction : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "Auction"
  }

},{timestamps : true })

const Message = mongoose.model("Message",messageSchema)
export default Message  ;