import { BASE_URL, SOCKET_URL } from "@/lib/baseUrl";
import axios from "axios";
import { data } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(persist((set, get) => ({
  authUser : null ,
  socket  : null ,
  isLoging : false, 
  isLogout : false,
  isRegistering : false,  
  register : async(data)=>{
    set({isRegistering : true}) 
    try {
      const res = await axios.post(`${BASE_URL}/user/register/`,data ,
         {withCredentials : true , 
          headers  : {
            "Content-Type" : "multipart/form-data"
          }
        } )
      toast.success("New Account Created") 
      set({authUser : res.data.user})

    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
    finally {
      set({isRegistering : false}) 
    } 
  },
  login : async(data)=>{
    set({isLoging : true}) 
    try {
      const res = await axios.post(`${BASE_URL}/user/login`,data,{withCredentials : true})
      set({authUser : res.data.user})
      toast.success("You are now logged In")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
    finally {
      set({isLoging : false}) 
    }  
  } ,
  logout : async()=>{
    set({isLogout : true}) 
    try {
      const res = await axios.post(`${BASE_URL}/user/logout`,{},{withCredentials : true})
      toast.success("You are Logged Out")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
    finally {
      set({authUser : null}) 
      useAuthStore.persist.clearStorage()
      set({isLogout : false}) 
    }
  },
  connectSocket: () => {
    const { authUser } = get() ;
    if (!authUser || get().socket?.connected) return ;
    const socket = io(SOCKET_URL, {
      transports: ["websocket"]
    }) ;
    socket.emit("setup", authUser) ;
    socket.on("connected", () => set({ socket: socket })) ;
  }
}),
  {
    name: "userData",
    partialize: (state) => ({
      authUser: (state.authUser)
    })
  }
)
)
