import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name : {
    type : String ,
    required : true 
  },
  email : {
    type : String ,
    unique : true ,
    required : true 
  } ,
  password : {
    type : String  ,
    required : true 
  } ,
  role : {
    type : String ,
    enum : ["Buyer","Seller"] ,
    default : "Buyer" 
  },
  avatar : {
    type : String  ,
    default : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80"
  }
}, { timestamps : true })  

const User = mongoose.model("User", userSchema )
export default User ;