import mongoose from "mongoose" 

export const connectDB = async()=>{
  try {
    const res = await mongoose.connect(process.env.MONGO_URL)
    console.log('Database is connected successfully ') ;
  } catch (error) {
    console.log(error) 
  }
}