import { Search, LogIn, LogOut, Gavel, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuctionStore } from "@/store/auctionStore";
import SearchArea from "./searchArea";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const [search, setSearch] = useState("");
  const { getAllAuctions } = useAuctionStore();
  const router = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    getAllAuctions(search);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b  backdrop-blur   ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
          onClick={() => router(authUser ? (authUser.role === "Buyer" ? "/buyer" : "/seller") : "/")}
        >
          <div className="w-8 h-8  rounded-lg flex items-center justify-center shadow-sm">
            <Gavel className="w-4 h-4 " />
          </div>
          <span className="text-lg font-bold  tracking-tight">
            Bid<span >Verse</span>
          </span>
        </button>


        {/* Right side */}
        <div className="flex items-center gap-3">
          {authUser?.role === "Buyer" && (
            <SearchArea/> 
          )}

          {authUser ? (
            <>
              {/* Role badge */}
              <Badge
                variant="ghost"
                className={`hidden sm:flex items-center gap-1 border-none rounded-lg font-semibold text-md p-4 `}
              >
                {authUser.role}
              </Badge>

              {/* User avatar */}
              <Avatar className="h-12 w-12 border-2  cursor-pointer  transition-colors">
                <AvatarImage
                  src={authUser?.avatar}
                  alt={authUser?.name}
                />
                <AvatarFallback className=" font-bold text-xs">

                </AvatarFallback>
              </Avatar>

              {/* Logout */}
              <Button
                variant="ghost"

                onClick={() => logout()}
                className=" h-10 px-3 gap-2"
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline text-lg font-medium">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <a href="#home" className="text-sm font-medium transition-colors hidden sm:inline-block">Home</a>
              <a href="#features" className="text-sm font-medium transition-colors hidden sm:inline-block">Features</a>
              <Button
                variant="ghost"
                size="sm"

                onClick={() => router("/auth")}
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => router("/auth")}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile search for Buyers */}
      {authUser?.role === "Buyer" && (
        <div className="sm:hidden px-4 pb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            <Input
              type="text"
              className="pl-9 h-9 "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search auctions..."
            />
          </div>
          <Button
            size="sm"
            className=" h-9 px-4"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      )}
    </nav>
  );
}