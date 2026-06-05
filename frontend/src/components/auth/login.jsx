import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { KeyRound, Loader2, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login , isLoging } = useAuthStore();

  const handleLogin = () => {
    const data = { email, password };
    login(data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="px-6 py-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-bold ">Welcome back</p>
        <p className="text-sm ">Enter your credentials to sign in.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-email" className="text-sm font-bold ">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              className="pl-9 h-11 "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="login-password" className="text-sm font-bold ">
            Password
          </Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              className="pl-9 h-11  "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full  h-11 font-bold mt-2 shadow-sm cursor-pointer"
        >
          {isLoging ? <Loader2 className="animate-spin" /> : "Sign In"}
        </Button>
      </div>
    </div>
  );
}