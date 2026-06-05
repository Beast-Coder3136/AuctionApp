import mongoose, { Schema } from "mongoose";

const biddingSchema = new Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction"
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Outbid", "Winning"],
    default: "Active"
  }
}, { timestamps: true })

const Bid = await mongoose.model("Bid", biddingSchema)
export default Bid;