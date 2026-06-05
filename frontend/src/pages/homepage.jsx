import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Clock, ShieldCheck, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { connectSocket } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 ">
            Bid Smarter. Win Faster.
          </h1>
          <p className="text-lg sm:text-xl  mb-10 max-w-2xl mx-auto leading-relaxed">
            BidVerse is a real-time online auction platform where users can create auctions, place live bids, and track auction activity instantly.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className=" hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg  flex items-center justify-center mb-4 ">
                <Zap className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold  ">Real-Time Bidding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" text-sm leading-relaxed">
                Instant bid updates powered by WebSockets.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className=" hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg  flex items-center justify-center mb-4 ">
                <Clock className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold">Live Auction Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" text-sm leading-relaxed">
                Track auction status and countdowns in real time.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="  hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg  flex items-center justify-center mb-4 ">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold ">Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" text-sm leading-relaxed">
                Protected user accounts and auction management.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="border rounded-2xl p-10 sm:p-14 text-center shadow-sm">
          <h2 className="text-3xl font-bold  mb-8">
            Ready to start bidding?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="  w-full sm:w-auto px-8 h-12 text-base shadow-sm"
              onClick={() => navigate("/auth")}
            >
              Explore Auctions
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="  w-full sm:w-auto px-8 h-12 text-base font-semibold shadow-sm"
              onClick={() => navigate("/auth")}
            >
              Create Auction
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t  mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg ">BidVerse</h3>
            <p className="text-sm  mt-1">
              Built with MERN Stack & Socket.IO
            </p>
          </div>
          
          
          <div className="text-sm ">
            &copy; {new Date().getFullYear()} BidVerse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}