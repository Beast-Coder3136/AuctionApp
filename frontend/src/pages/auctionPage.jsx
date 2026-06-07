import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuctionStore } from "@/store/auctionStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft, TrendingUp, Users } from "lucide-react";
import MessageBox from "@/components/message/messageBox";

export default function AuctionPage() {
  const { id } = useParams();
  const router = useNavigate();
  const { authUser, socket } = useAuthStore();
  const { getAuctionById, auctionById: auction, bids, placeBid, getAllBids, setBids, setAuction } = useAuctionStore();
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    getAuctionById(id);
    getAllBids(id);
    if (!socket) {
      router("/")
    }
    else {
      socket.emit("join-auction", id)
    }
  }, [id, getAuctionById, getAllBids]);

  useEffect(() => {
    if (!socket) return

    const handleNewBid = (newBid) => {
      if(newBid?.bidder?._id === authUser?._id) return 
      console.log(newBid)
      let idx = bids.findIndex((bid) => bid._id === newBid._id)
      if (idx === -1) {
        setBids([newBid,...bids])
      }
      else {
        bids.splice(idx, 1)
        setBids([ newBid,...bids])
      }
      setAuction(newBid.auction)
    }

    const handleLiveAuctions = (liveAuctions) => {
      if (liveAuctions.includes(auction?._id) === true) {
        setAuction({ ...auction, status: "Live" })
      }
    }
    const handleEndedAuctions = (endedAuctions) => {
      if (endedAuctions.includes(auction?._id) === true) {
        setAuction({ ...auction, status: "Completed" })
      }
    }
    socket?.on("new-bid-recieve", handleNewBid)
    socket?.on("liveAuctions", handleLiveAuctions)
    socket?.on("endedAuctions", handleEndedAuctions)

    return () => {
      socket.off("new-bid-recieve", handleNewBid);
      socket.off("liveAuctions", handleLiveAuctions);
      socket.off("endedAuctions", handleEndedAuctions);
    };
  },[socket,bids])


  const handlePlaceBid = async () => {
    if (!bidAmount) return;
    const data = {
      auctionId: id,
      amount: bidAmount
    };
    placeBid(data);
    
    setBidAmount("");
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "Live": return "bg-green-200 text-green-800";
      case "Upcoming": return "bg-yellow-200 text-black";
      case "Completed": return "bg-gray-200 text-gray-800";
      default: return "bg-[#CCFBF1] text-[#0A1628]";
    }
  };

  return (
    <div className="min-h-screen   py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <Button variant="ghost" className="  transition-colors -ml-4" onClick={() => router(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Auctions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 ">

          {/* Main Content: Image & Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className=" rounded-xl shadow-sm border  overflow-hidden">
              <div className="p-4 md:p-4 flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 w-full md:w-1/2 aspect-square rounded-lg overflow-hidden flex items-center justify-center relative" >
                  {auction?.status && (
                    <div className="absolute top-0 left-0 drop-shadow-sm">
                      <Badge className={`font-semibold border-none px-3 py-1 ${getStatusColor(auction.status)}`}>
                        {auction.status.toUpperCase()}
                      </Badge>
                    </div>
                  )}

                  <img
                    src={auction?.image || "https://placehold.co/600?text=No+Image"}
                    alt={auction?.title}
                    className="object-contain w-full h-full"
                  />

                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <div>
                    <h1 className="text-3xl font-bold  tracking-tight leading-tight mb-3">
                      {auction?.title || "Loading..."}
                    </h1>
                    <p className=" leading-relaxed text-sm">
                      {auction?.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className=" p-4 rounded-lg border  flex flex-col justify-center">
                      <div className="flex items-center mb-1">
                        <TrendingUp className="w-3.5 h-3.5 mr-2 " />
                        <span className="text-xs font-bold uppercase tracking-wider">Current Bid</span>
                      </div>
                      <div className="text-3xl font-bold  mt-1">
                        ${auction?.currentBid || auction?.startingBid || '0'}
                      </div>
                    </div>
                    <div className=" p-4 rounded-lg border  flex flex-col justify-center">
                      <div className="flex items-center  mb-1">
                        <Clock className="w-3.5 h-3.5 mr-2 " />
                        <span className="text-xs font-bold uppercase tracking-wider">Ends In</span>
                      </div>
                      <div className="text-lg font-semibold  mt-1">
                        {auction?.endTime ? new Date(auction.endTime).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm  font-medium">
                        {auction?.endTime ? new Date(auction.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </div>
                  </div>

                  {authUser?.role === "Buyer" && (
                    <div className="mt-auto pt-6 border-t ">
                      <Label htmlFor="bid" className="text-sm font-semibold  mb-2 block">
                        Place a Bid
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="bid"
                          type="number"
                          placeholder="Enter amount"
                          disabled={auction?.status !== "Live"}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="flex-1  h-11"
                        />
                        <Button
                          onClick={handlePlaceBid}
                          disabled={auction?.status !== "Live"}
                          className=" h-11"
                        >
                          Place Bid
                        </Button>
                      </div>
                      {auction?.status !== "Live" && (
                        <p className="text-xs  mt-2 font-medium">Bidding is closed or not yet started for this item.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>



          {/* Sidebar: Bid History */}
          <div className="lg:col-span-4">
            <div className=" rounded-xl shadow-sm border  h-full max-h-[700px] flex flex-col">
              <div >
                <MessageBox auctionId={id} />
              </div>
              <div className="p-5 border-b  flex items-center justify-between  rounded-t-xl">
                <h3 className="text-base font-bold  flex items-center">
                  <Users className="w-5 h-5 mr-2 " />
                  Live Bids
                </h3>
                <Badge variant="secondary" className="  font-bold px-2 py-1">
                  {bids?.length || 0} Bids
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {bids && bids.length > 0 ? (
                  <ul className="space-y-1">
                    {bids.map((item, idx) => (
                      <li key={idx} className="p-3  rounded-lg transition-colors flex items-center gap-3 border border-transparent ">
                        <Avatar className="h-9 w-9  border-none">
                          <AvatarImage src={item?.bidder?.avatar} />
                          <AvatarFallback className=" font-semibold">{item.bidder?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold  truncate">
                            {item.bidder?.name || "Anonymous User"}
                          </p>
                          <p className="text-xs  font-medium">
                            {new Date(item.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="font-bold  px-3 py-1.5 rounded-md text-sm shadow-sm border ">
                          ${item.amount}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center  space-y-4 p-8 text-center">
                    <Clock className="w-10 h-10 " />
                    <div>
                      <p className="text-base font-medium ">No bids yet</p>
                      <p className="text-sm mt-1">Be the first to leave a mark!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}