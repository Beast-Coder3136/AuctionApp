import Auction from '../models/auction.js'
import Bid from '../models/bid.js'

export const getBids = async (req, res) => {
  try {
    const { auctionId } = req.params
    const bids = await Bid.find({ auction: auctionId }).sort({ amount: -1 }).populate("bidder", "-password")

    return res.status(200).json({
      success: true,
      bids
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body
    if (!auctionId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Fields"
      })
    }

    const auction = await Auction.findOneAndUpdate({
      _id: auctionId,
      status: "Live",
      currentBid: { $lt: amount }
    },
      {
        $set: {
          currentBid: amount,
          highestBidder: req.user.id
        }
      },
      {
        new: true
      }
    )

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found or Not Live or Amount is Less than Current Bid"
      })
    }

    let bid = await Bid.findOne({ auction: auctionId, bidder: req.user.id })
    if (!bid) {
      bid = await Bid.create({
        auction: auctionId,
        bidder: req.user.id,
        amount: amount
      })
    }
    bid.amount = amount
    auction.currentBid = amount
    auction.highestBidder = bid.bidder
    await bid.save()
    await auction.save()
    await bid.populate("bidder", "-password")
    await bid.populate("auction")
    return res.status(202).json({
      success: true,
      bid,
      auction
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body
    const bidId = req.params.id
    if (!auctionId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Fields"
      })
    }
    const auction = await Auction.findById(auctionId)
    if (auction.currentBid >= amount) {
      return res.status(400).json({
        success: false,
        message: "Cannot Bid"
      })
    }
    const bid = await Bid.findByIdAndUpdate(bidId, { amount }, { new: true }).populate("bidder", "-password")
    auction.currentBid = amount
    auction.highestBidder = bid.bidder
    await auction.save()
    return res.status(200).json({
      success: true,
      message: "Bid Updated",
      bid
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateBidStatus = async (req, res) => {
  try {
    const { status, bidId } = req.body
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Status Field"
      })
    }
    const bid = await Bid.findByIdAndUpdate(bidId, { status })
    return res.status(200).json({
      success: true,
      message: "Status successfully updated"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

