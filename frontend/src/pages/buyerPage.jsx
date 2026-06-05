import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuctionStore } from "@/store/auctionStore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Clock } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export default function BuyerPage() {
  const router = useNavigate()
  const { auctions, getAllAuctions, setAuctions, totalPages } = useAuctionStore()
  const [filterValue, setFilterValue] = useState("All")
  const { connectSocket, socket } = useAuthStore()
  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => {
    getAllAuctions("", currentPage)
    connectSocket()
  }, [currentPage])

  const [filterAuctions, setFilterAuctions] = useState(auctions)
  useEffect(() => {
    if (filterValue === "All") {
      setFilterAuctions(auctions)
    } else {
      setFilterAuctions(auctions.filter((a) => a.status === filterValue))
    }
  }, [auctions, filterValue])

  useEffect(() => {
    if (!socket) return

    const handleLiveAuctions = (liveIds) => {
      const updatedAuctions = auctions.map((a) =>
        liveIds.includes(a._id)
          ? { ...a, status: "Live" }
          : a
      );
      setAuctions(updatedAuctions);
    };

    const handleEndedAuctions = (endedIds) => {
      const updatedAuctions = auctions.map((a) =>
        endedIds.includes(a._id)
          ? { ...a, status: "Completed" }
          : a
      );
      setAuctions(updatedAuctions);
    };
    socket.on("liveAuctions", handleLiveAuctions);
    socket.on("endedAuctions", handleEndedAuctions);

    return () => {
      socket.off("liveAuctions", handleLiveAuctions);
      socket.off("endedAuctions", handleEndedAuctions);
    };
  }, [socket, auctions])

  const getStatusColor = (status) => {
    switch (status) {
      case "Live": return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Upcoming": return "bg-yellow-100 text-[#0A1628] hover:bg-[#7C3AED]"
      case "Completed": return "bg-slate-200 text-[#0A1628] hover:bg-slate-200"
      default: return "bg-[#CCFBF1] text-[#0A1628] hover:bg-[#CCFBF1]"
    }
  }

  const formatTime = (time) => {
    if (!time) return "N/A"
    const date = new Date(time);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const getPageNumbers = () => {
    const pages = [];
    console.log("Running Page Number")
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8  min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b  pb-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight ">
            Auctions Dashboard
          </h1>
          <p className=" mt-1">Discover and bid on exclusive items.</p>
        </div>
        <Tabs value={filterValue} onValueChange={setFilterValue} className="w-full md:w-auto overflow-x-auto">
          <TabsList className=" w-full justify-start md:justify-center p-1 rounded-lg">
            <TabsTrigger value="All" >All Items</TabsTrigger>
            <TabsTrigger value="Live" >Live Now</TabsTrigger>
            <TabsTrigger value="Upcoming" >Upcoming</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>



      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
             gap-6  pb-6">
        {filterAuctions?.length > 0 ? (
          filterAuctions.map((item, idx) => (
            <Card
              className="group cursor-pointer  transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden flex flex-col rounded-xl"
              key={idx}
              onClick={() => router(`/auction/${item._id}`)}
            >
              <div className="relative aspect-square overflow-hidden  flex items-center justify-center border-b  ">
                <img
                  src={item?.image || "https://placehold.co/400?text=No+Image"}
                  alt={item?.title}
                  className="object-contain  w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`font-medium shadow-sm border-0 ${getStatusColor(item.status)}`}>
                    {item.status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 flex-grow flex flex-col gap-3">
                <h2 className="text-lg font-bold line-clamp-1 " title={item?.title}>
                  {item?.title}
                </h2>

                <div className="flex justify-between items-end mt-auto pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px]  font-bold uppercase tracking-wider mb-1">
                      {item.status === 'Upcoming' ? 'Starting Bid' : 'Current Bid'}
                    </span>
                    <span className="text-xl font-bold ">
                      ${item.status === 'Upcoming' ? item?.startingBid : (item?.currentBid || item?.startingBid || '0')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs  mt-2  p-2.5 rounded-md border ">
                  <Clock className="w-3.5 h-3.5  flex-shrink-0" />
                  <span className="font-medium truncate">
                    {item.status === 'Ended' ? 'Ended :' : (item.status === 'Live' ? 'Ends :' : 'Starts :')}
                    {' '}{formatTime(item.status === 'Ended' || item.status === 'Live' ? item.endTime : item.startTime)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))


        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center  rounded-xl border border-dashed  shadow-sm">
            <span className="text-lg font-bold ">No auctions match your selection.</span>
            <span className="text-sm mt-1 ">Try changing the filter tabs above.</span>
          </div>
        )}
      </div>


      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  )
}
