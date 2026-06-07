import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useMessageStore } from "@/store/messageStore";
import MessageBubble from "./messageBubble";
import { useAuthStore } from "@/store/authStore";
import { Textarea } from "../ui/textarea";
import { MessageCircle } from "lucide-react";

export default function MessageBox({ auctionId }) {
  const [content, setContent] = useState("")
  const { sendMessage, getMessages, messages, setMessages } = useMessageStore()
  const { socket, authUser } = useAuthStore()
  useEffect(() => {
    getMessages(auctionId)
  }, [])

  useEffect(() => {
    if (!socket) return
    const handleNewMessage = (newMessage) => {
      if(newMessage?.sender?._id === authUser?._id) return 
      let updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)
    }
    socket?.on("new-message-recieve", handleNewMessage)
    return () => {
      socket.off("new-message-recieve", handleNewMessage);
    };
  },[socket,messages])

  const handleSendMessage = async () => {
    await sendMessage({ auctionId, content })
    setContent("")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full  text-md py-4 cursor-pointer " > <MessageCircle /> Chat  Lobby</Button>
      </SheetTrigger>

      <SheetContent className='min-w-125 flex flex-col h-full'>
        <SheetHeader>
          <SheetTitle>Message Lobby</SheetTitle>
          <SheetDescription>
            Here you can chat with all bidders
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full mt-4">
          <div className="flex-1 overflow-y-auto relative flex flex-col gap-3 p-4  rounded-lg border custom-scrollbar mb-4">
            {messages?.map((message, idx) => (
              <MessageBubble
                key={idx}
                isMe={authUser?._id === message?.sender?._id}
                sender={message?.sender}
                content={message?.content}
              />
            ))
            }
          </div>
          <div className="flex gap-2 w-full p-1 items-end  rounded-xl shadow-sm  transition-all">
            <Textarea
              className='flex-1 border-0 focus-visible:ring-0 shadow-none resize-none min-h-[44px] max-h-[120px] py-3 px-4 bg-transparent text-md'
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Write message here..."
              rows={1}
            />
            <Button
              className=" rounded-lg h-10 px-4 m-1 shadow-sm font-semibold transition-all cursor-pointer"
              onClick={handleSendMessage}
              disabled={!content.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}