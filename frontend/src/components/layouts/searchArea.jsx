import { Label } from "radix-ui";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Input } from "../ui/input";
import { useState } from "react";
import { useAuctionStore } from "@/store/auctionStore";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";

export default function SearchArea() {
  const [search , setSearch ] = useState("")
  const [open, setOpen] = useState(false)
  const { searchAuctions , searchedAuctions } = useAuctionStore()
  const router = useNavigate();

  const handleSearch = (e)=>{
    if (e) e.preventDefault();
    if (!search.trim()) return;
    searchAuctions(search.trim())
  }

  const handleNavigate = (id) => {
    setOpen(false);
    router(`/auction/${id}`);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Live": return "bg-green-100 text-green-800"
      case "Upcoming": return "bg-yellow-100 text-[#0A1628]"
      case "Completed": return "bg-slate-200 text-[#0A1628]"
      default: return "bg-[#CCFBF1] text-[#0A1628]"
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>     
          <Button 
            size="sm"
            variant="outline"
            className=" h-9 px-4 cursor-pointer font-semibold"     
          >
            Search
          </Button>
      </SheetTrigger>

      <SheetContent 
      className='flex flex-col max-h-[85vh]' 
      side="top"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Search Product by name</SheetTitle>
          <SheetDescription>
            Here you can search products
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 items-center w-full overflow-hidden p-2">
          <form onSubmit={handleSearch} className="flex gap-2 justify-center items-center w-full max-w-lg" >
            <Input placeholder="Search..."  
            className='w-full'
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            />
            <Button 
            type="submit"
            disabled={!search.trim()}
            > Search </Button>
          </form>
          
          <ScrollArea className="w-full h-[60vh] px-4 rounded-md border border-gray-200 border-solid ">
            {searchedAuctions?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-4 px-8 py-4">
                {searchedAuctions.map((auction,idx)=>(
                  <Card 
                    key={idx}
                    className="group cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden flex flex-row items-center p-4 gap-4
                    border-1 border-gray-300 
                    "
                    onClick={() => handleNavigate(auction._id)}
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-secondary/50 border relative">
                      <img src={auction.image || "https://placehold.co/100?text=No+Image"} alt={auction.title} className="w-full h-full object-contain transition-transform group-hover:scale-110 p-1" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden min-w-0 gap-1">
                      <h4 className="text-sm font-bold truncate">{auction.title}</h4>
                      <div className="flex items-center">
                        <Badge className={`border-none px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(auction.status)}`}>
                          {auction.status?.toUpperCase() || "UNKNOWN"}
                        </Badge>
                      </div>
                      <p className="text-sm font-bold mt-1 text-muted-foreground">Starting Bid: <span className="text-foreground">${auction.startingBid}</span></p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              search && searchedAuctions?.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground font-medium">
                  No auctions found matching "{search}"
                </div>
              ) : null
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}