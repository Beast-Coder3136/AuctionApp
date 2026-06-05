import mongoose, { mongo, Schema } from "mongoose";

const auctionSchema = new Schema({
  title : {
    type : String ,
    required : true 
  },
  description : {
    type : String  ,
    required  : true 
  },
  image : {
    type : String   ,
    default : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/330px-No_image_available.svg.png?_=20251111182856'
  } ,
  startingBid : {
    type : Number  ,
    required : true 
  } ,
  currentBid : {
    type: Number,
    default: function () {
    return this.startingBid;
    }
  },
  highestBidder : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User" 
  },

  status : {
    type : String ,
    enum : ["Live","Upcoming","Completed"],
    default : "Upcoming"
  },

  auctioneer : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User" 
  },

  startTime : {
    type : Date ,
    required : true 
  },
  endTime : {
    type : Date ,
    required : true 
  }

}, {timestamps : true } )

const Auction =   mongoose.model("Auction",auctionSchema)
export default Auction 