import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { KeyRound, Mail, User, ShoppingCart, Store, Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Buyer");
  const [file, setFile] = useState(null);
  const { register ,isRegistering } = useAuthStore();

  const handleRegister = () => {
    const data = { name, email, password, role ,  file };
    console.log(data) 
   register(data);
  };

  return (
    <div className="px-6 py-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-bold ">Create your account</p>
        <p className="text-sm ">Join BidVerse and start bidding or selling today.</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg-name" className="text-sm font-bold ">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
            <Input
              id="reg-name"
              type="text"
              placeholder="John Doe"
              className="pl-9 h-11 "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg-email" className="text-sm font-bold ">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
            <Input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              className="pl-9 h-11 "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg-password" className="text-sm font-bold ">
            Password
          </Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input
              id="reg-password"
              type="password"
              placeholder="Min. 8 characters"
              className="pl-9 h-11 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Profile Pic */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg-pic" className="text-sm font-bold ">
            Profile Picture <span className="font-normal ">(optional)</span>
          </Label>
          <div className="border border-dashed ">
            <Input
              id="reg-pic"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border-0 bg-transparent p-0 text-sm  file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold "
            />
          </div>
        </div>

        {/* Role */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-bold ">Select Role</Label>
          <RadioGroup
            value={role}
            onValueChange={setRole}
            className="grid grid-cols-2 gap-3 mt-1"
          >
            <label
              htmlFor="role-buyer"
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                role === "Buyer"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-transparent hover:bg-secondary/50"
              }`}
            >
              <RadioGroupItem value="Buyer" id="role-buyer" className="hidden" />
              <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${role === "Buyer" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-sm font-bold transition-colors ${role === "Buyer" ? "text-foreground" : "text-muted-foreground"}`}>Buyer</p>
                <p className="text-xs text-muted-foreground leading-tight">Browse & bid on items</p>
              </div>
            </label>

            <label
              htmlFor="role-seller"
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                role === "Seller"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-transparent hover:bg-secondary/50"
              }`}
            >
              <RadioGroupItem value="Seller" id="role-seller" className="hidden" />
              <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${role === "Seller" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                <Store className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-sm font-bold transition-colors ${role === "Seller" ? "text-foreground" : "text-muted-foreground"}`}>Seller</p>
                <p className="text-xs text-muted-foreground leading-tight">List & manage auctions</p>
              </div>
            </label>
          </RadioGroup>
        </div>
        <Button
          onClick={handleRegister}
          className="w-full  h-11 font-bold mt-2 cursor-pointer shadow-sm"
        >
          {isRegistering ? <Loader2 className="animate-spin" /> : "Create Account"}
        </Button>
      </div>
    </div>
  );
}
