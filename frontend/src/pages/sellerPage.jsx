import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuctionStore } from "@/store/auctionStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Clock,
  Package,
  RadioTower,
  CalendarCheck2,
} from "lucide-react";
import AuctionFormDialog from "@/components/auction/auctionForm";
import AuctionCard from "@/components/auction/auctionCard";
import { io } from "socket.io-client";
import { BASE_URL } from "@/lib/baseUrl";
import { useAuthStore } from "@/store/authStore";


export default function SellerPage() {
  const { createAuction, sellerAuctions, getSellerAuctions, updateAuction, setSellerAuctions } = useAuctionStore();
  const { authUser, connectSocket, socket } = useAuthStore()
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [file, setFile] = useState(null);
  const router = useNavigate();

  useEffect(() => {
    getSellerAuctions();
    connectSocket()
  }, []);

  useEffect(() => {
    if (!socket) return

    const handleLiveAuctions = (liveAuctions) => {
      let updatedAuctions = sellerAuctions.map((a) => {
        if (liveAuctions.includes(a?._id)) {
          return { ...a, status: "Live" }
        }
        return a
      })
      setSellerAuctions(updatedAuctions)
    }

    const handleEndedAuctions = (endedAuctions) => {
      let updatedAuctions = sellerAuctions.map((a) => {
        if (endedAuctions.includes(a?._id)) {
          return { ...a, status: "Completed" }
        }
        return a
      })
      setSellerAuctions(updatedAuctions)
    }
    socket?.on("liveAuctions", handleLiveAuctions)
    socket?.on("endedAuctions",handleEndedAuctions)
    return () => {
      socket.off("liveAuctions", handleLiveAuctions);
      socket.off("endedAuctions", handleEndedAuctions);
    };
  }, [socket, sellerAuctions])

  const formatForInput = (isoString) => {
    const date = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const validateTime = () => {
    if (!startTime || !endTime) {
      alert("Select both times");
      return null;
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    if (start < now) { alert("Start time cannot be in the past"); return null; }
    if (end <= start) { alert("End time must be after start time"); return null; }
    return { start, end };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const times = validateTime();
    if (!times) return;
    const { start, end } = times;
    const data = { title, description, startTime: start.toISOString(), startingBid, endTime: end.toISOString(), file };
    if (edit) {
      updateAuction(id, data);
    } else {
      createAuction(data);
    }
    setOpen(false);
  };

  const handleImage = (e) => {
    e.preventDefault();
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const openCreate = () => {
    setEdit(false);
    setTitle(""); setDescription(""); setStartTime(null);
    setEndTime(""); setStartingBid(""); setId("");
    setOpen(true);
  };

  const openEdit = (item) => {
    setEdit(true);
    setTitle(item.title);
    setDescription(item.description);
    setStartingBid(item.startingBid);
    setStartTime(formatForInput(item.startTime));
    setEndTime(formatForInput(item.endTime));
    setId(item._id);
    setOpen(true);
  };

  let liveAuctions = sellerAuctions.filter((a) => a?.status === "Live");
  let upcomingAuctions = sellerAuctions.filter((a) => a?.status === "Upcoming");
  let endedAuctions = sellerAuctions.filter(
    (a) => a?.status === "Ended" || a?.status === "Completed"
  );

  const formState = { title, description, startingBid, startTime, endTime };
  const setters = { setTitle, setDescription, setStartingBid, setStartTime, setEndTime, handleImage };


  return (
    <div className="max-w-7xl mx-auto  px-6 py-8 flex flex-col ">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div >
          <h1 className="text-3xl font-bold tracking-tight ">Seller Dashboard</h1>
          <p className=" mt-1">Manage and monitor all your auction listings.</p>
        </div>
        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button
              className=" h-10 px-5 font-semibold shadow-sm cursor-pointer"
              onClick={openCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Auction
            </Button>
          </DialogTrigger>
          <AuctionFormDialog
            open={open}
            setOpen={setOpen}
            edit={edit}
            onSubmit={handleSubmit}
            formState={formState}
            setters={setters}
          />
        </Dialog>
      </div>

      {/* Live Auctions */}
      <div className="flex-col items-center ">
        {liveAuctions.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <RadioTower className="w-5 h-5 " />
              <h2 className="text-xl font-bold ">Live Auctions</h2>
              <Badge className=" border-none font-bold">
                {liveAuctions.length}
              </Badge>
            </div>

            <div className="grid grid-rows-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-4">
              {liveAuctions.map((item, idx) => (
                <AuctionCard
                  key={idx}
                  item={item}
                  onView={(id) => router(`/auction/${id}`)}
                  onEdit={openEdit}
                />
              ))}
            </div>

          </div>
        )}
        {/* Upcoming Auctions */}
        {upcomingAuctions.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 " />
              <h2 className="text-xl font-bold ">Upcoming Auctions</h2>
              <Badge className=" border-none font-bold">
                {upcomingAuctions.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-4">
              {upcomingAuctions.map((item, idx) => (
                <AuctionCard
                  key={idx}
                  item={item}
                  onView={(id) => router(`/auction/${id}`)}
                  onEdit={openEdit}
                />
              ))}
            </div>
          </div>
        )}
        {/* Ended Auctions */}
        {endedAuctions.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <CalendarCheck2 className="w-5 h-5 " />
              <h2 className="text-xl font-bold ">Ended Auctions</h2>
              <Badge className=" border-none font-bold">
                {endedAuctions.length}
              </Badge>
            </div>

            <div className="grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-4">
              {endedAuctions.map((item, idx) => (
                <AuctionCard
                  key={idx}
                  item={item}
                  onView={(id) => router(`/auction/${id}`)}
                  onEdit={openEdit}
                />
              ))}
            </div>

          </div>
        )}
        {/* Empty State */}
        {sellerAuctions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed  text-center gap-4">
            <div className="w-14 h-14  rounded-xl flex items-center justify-center shadow-sm">
              <Package className="w-7 h-7 " />
            </div>
            <div>
              <p className="text-lg font-semibold ">No auctions yet</p>
              <p className="text-sm  mt-1">Click "New Auction" to create your first listing.</p>
            </div>
            <Button
              className=" mt-2"
              onClick={openCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Auction
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}