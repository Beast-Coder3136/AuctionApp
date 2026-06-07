import { BASE_URL } from "@/lib/baseUrl";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useAuctionStore = create((set,get)=>({

  auctions : [] ,
  sellerAuctions : [] , 
  searchedAuctions : [] ,
  auctionById : null ,
  bids : [] ,
  totalPages : 1 ,
  getAllAuctions : async(searchQuery,currentPage)=>{
    try {
      const res = await axios.get(`${BASE_URL}/auction?search=${searchQuery}&page=${currentPage}&limit=${10}`,{withCredentials : true})
      console.log(res.data)
      set({auctions : res.data.auctions})
      set( {totalPages : res.data.totalPages})
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      let authorized = error?.response?.data?.authorized 
      const { logout } = useAuthStore.getState()
      if(authorized=== false ){
        logout()
      }
      toast.error(err)
    }     
  },
  getSellerAuctions : async()=>{
    try {

      const res = await axios.get(`${BASE_URL}/auction/seller`,{withCredentials : true})
      set({sellerAuctions : res.data.auctions})
    } catch (error) {
      console.log(error.response)
      let authorized = error?.response?.data?.authorized 
      const { logout } = useAuthStore.getState()
      if(authorized=== false ){
        logout()
      }
    }
  } ,
  getAuctionById : async(id)=>{
     try {
      const res = await axios.get(`${BASE_URL}/auction/${id}`,{withCredentials : true})
      set({auctionById : res.data.auction})
     } catch (error) {
      console.log(error.response)
      let authorized = error?.response?.data?.authorized 
      const { logout } = useAuthStore.getState()
      if(authorized=== false ){
        logout()
      }
     }
  },
  createAuction : async(data)=>{
    try {
      const res = await axios.post(`${BASE_URL}/auction/`,data,{withCredentials : true,
        headers : {
          "Content-Type" : "multipart/form-data"
        }
      })
      console.log(res.data.auction)
      set({ sellerAuctions : [ ...get().sellerAuctions , res.data.auction  ]})
      toast.success("New Auction Created")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      let authorized = error?.response?.data?.authorized 
      const { logout } = useAuthStore.getState()
      if(authorized=== false ){
        logout()
      }
      toast.error(err)
    }
  },
  updateAuction : async(id,data)=>{
    try {
      const res = await axios.put(`${BASE_URL}/auction/${id}`,data, {withCredentials : true})
      let currAuctions = get().sellerAuctions 
      let idx = currAuctions.findIndex((a)=>a._id===id)
      currAuctions[idx] = res.data.auction
      set({ sellerAuctions :  currAuctions })
      toast.success("Updated Successfully")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"      
      toast.error(err)
    }
  },
  placeBid : async(data)=>{
    try {
      const res = await axios.post(`${BASE_URL}/bid/`, data , {withCredentials : true} )
      let { bids } = get() 
      let idx = bids.findIndex((bid)=>bid._id===res.data.bid._id) 
      if(idx==-1){
        bids.unshift(res.data.bid)
      }
      else {
        bids.splice(idx,1)
        bids.unshift(res.data.bid)
      }
      set({ bids : bids}) 
      set({auctionById : res.data.auction})
      toast.success("New Bid placed")
      return res.data.bid
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
  },
  getAllBids : async(auctionId)=>{
    try {
      const res = await axios.get(`${BASE_URL}/bid/${auctionId}`,{withCredentials : true})
      set({bids : res.data.bids})
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      let authorized = error?.response?.data?.authorized 
      const { logout } = useAuthStore.getState()
      if(authorized=== false ){
        logout()
      }
      toast.error(err)
    }
  } ,
  searchAuctions : async(searchQuery)=>{
    try {
      const res = await axios.get(`${BASE_URL}/auction?search=${searchQuery}`,{withCredentials : true})
      set({searchedAuctions : res.data.auctions})
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      let authorized = error?.response?.data?.authorized 
      const { logout } = useAuthStore.getState()
      if(authorized && authorized=== false ){
        logout()
      }
      toast.error(err)
    }
  },
  setBids : (newBids)=>{
    set({bids : newBids})
  },
  setAuction : (newAuction)=>{
    set({auctionById : newAuction})
  } ,
  setAuctions : (newAuctions)=>{
    set({auctions : newAuctions})
  },
  setSellerAuctions : (newAuctions)=>{
    set({sellerAuctions : newAuctions})
  }
}))

