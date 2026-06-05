import cron from 'node-cron'
import Auction from '../models/auction.js';
import { io } from './socket.js';

export const startCronJobs = () => {
  // every minute
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running cron...");
    const now = new Date();
    try {
      // Start auctions
      const auctionsToStart = await Auction.find({ startTime: { $lte: now }, status: "Upcoming" })
      const auctionsToEnd = await Auction.find({ endTime: { $lte: now }, status: "Live" })
      await Auction.updateMany(
        {
          _id: { $in: auctionsToStart.map(a => a._id) }
        } ,
        { $set: { status: "Live" } }
      );
      // End auctions
      await Auction.updateMany(
        {
          _id: { $in: auctionsToEnd.map(a => a._id) }
        } ,
        { $set: { status: "Completed" } } ,
      );
      if(auctionsToStart.length!==0){
        io.emit("liveAuctions",auctionsToStart.map(a=>a._id))
        console.log(auctionsToStart)
      }
      if(auctionsToEnd.length!==0){
        io.emit("endedAuctions",auctionsToEnd.map(a=>a._id))
        console.log(auctionsToEnd)
      }
      console.log("Auction status updated");
    } catch (err) {
      console.error("Cron error:", err);
    };
  });
};