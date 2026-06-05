import { BASE_URL } from "@/lib/baseUrl";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useMessageStore  = create((set,get)=>({
  messages : [] ,

  getMessages : async(auctionId)=>{
    try {
      const res = await axios.get(`${BASE_URL}/message/${auctionId}`,{withCredentials : true})

      set({messages : res.data.messages })
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
  },
  sendMessage : async(data)=>{
    try {
      const res = await axios.post(`${BASE_URL}/message`,data,{withCredentials : true})
      console.log(res)
      let { messages } = get()
      set({messages : [...messages , res.data.message]})
      return res.data.message
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
  } ,
  setMessages : (newMessages)=>{
    set({ messages : newMessages })
  }
}))