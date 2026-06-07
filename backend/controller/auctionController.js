import cloudinary from "../middlewares/cloudinary.js";
import getDataUri from "../middlewares/dataUri.js";
import Auction from "../models/auction.js";

export const searchAuction = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ],
      }
      : {};

    const pageNo = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10 
    const skip = (pageNo - 1) * limit


    const auctions = await Auction.find(keyword)
      .skip(skip).limit(limit)
      .populate("auctioneer", "-password")
      .populate("highestBidder", "-password")

    
    const totalProuducts = await Auction.countDocuments()
    const totalPages = Math.ceil(totalProuducts/limit)
    return res.status(200).json({
      success: true,
      auctions,
      currentPage : pageNo ,
      totalPages
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getAuctionById = async (req, res) => {
  try {
    const auctionId = req.params.id
    if (!auctionId) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Id"
      })
    }

    const auction = await Auction.findById(auctionId).populate("auctioneer", "-password").populate("highestBidder", "-password")

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found"
      })
    }
    return res.status(200).json({
      success: true,
      auction,
      message: "Auction Found"
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createAuction = async (req, res) => {
  try {
    const { title, description, startingBid, startTime, endTime } = req.body
    if (!title || !description || !startingBid || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Required Field"
      })
    }
    // if (!req.file) {
    //   return res.status(400).json({ success : false , message: 'No file uploaded' });
    // }

    // if (!req.file.mimetype.startsWith('image')) {
    //   return res.status(400).json({ success : false , message: 'Only images allowed' });
    // }
    const file = req.file;
    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: 'AuctionApp/auctions'
      });
    }
    const newAuction = new Auction({
      title, description, startingBid, startTime, endTime, auctioneer: req.user.id
    })

    if (cloudResponse) {
      newAuction.image = cloudResponse.secure_url
    }
    await newAuction.save()
    await newAuction.populate("auctioneer", "-password")
    return res.status(202).json({
      success: true,
      auction: newAuction
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateAuction = async (req, res) => {
  try {
    const bidId = req.params.id

    const { title, description, startingBid, startTime, endTime } = req.body

    const auction = await Auction.findById(bidId)
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found"
      })
    }
    if (auction.status === "Live") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit ongoing auction"
      })
    }
    auction.title = title ? title : auction.title
    auction.description = description ? description : auction.description
    auction.startingBid = startingBid ? startingBid : auction.startingBid
    auction.startTime = startTime ? startTime : auction.startTime
    auction.endTime = endTime ? endTime : auction.endTime

    auction.currentBid = auction.startingBid

    await auction.save()
    await auction.populate("auctioneer", "-password")
    return res.status(200).json({
      success: true,
      message: "Message Updated Successfully",
      auction: auction
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getSellerAuction = async (req, res) => {
  try {
    const myauctions = await Auction.find({ auctioneer: req.user.id })
    return res.status(200).json({
      success: true,
      auctions: myauctions
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
