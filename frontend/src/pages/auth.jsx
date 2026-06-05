import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen ] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12  rounded-xl shadow-sm mb-4">
            <Gavel className="w-6 h-6 " />
          </div>
          <h1 className="text-2xl font-bold  tracking-tight">
            Bid<span className="">Verse</span>
          </h1>
          <p className="text-sm  mt-1">Bid, sell, and win — all in one place.</p>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border shadow-sm overflow-hidden">
          <Tabs defaultValue="login" className="w-full">
            <div className="px-6 pt-5">
              <TabsList className="w-full  h-10 p-1 rounded-lg">
                <TabsTrigger
                  value="login"
                  className="flex-1  font-bold rounded-md"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className= " flex-1 "
                >
                  Create Account
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="login" className="mt-0">
              <Login />
            </TabsContent>
            <TabsContent value="register" className="mt-0">
              <Register />
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}