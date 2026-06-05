import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function MessageBubble({isMe , sender , content}) {

  return (
    <div className={`flex w-full mb-2 gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      
      {
        !isMe && <Avatar className="h-8 w-8 shrink-0 mt-auto border shadow-sm">
          <AvatarImage src={sender?.avatar} />
          <AvatarFallback className="text-[10px]">
            {sender?.name?.substring(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
      }
      <div
        className={`px-4 py-2 rounded-2xl max-w-[80%] lg:max-w-xl text-sm shadow-sm transition-all
          ${isMe
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-secondary text-secondary-foreground rounded-bl-sm border"
          }`}
      >
        {!isMe && sender?.name &&(
          <p className="text-[10px] font-bold opacity-70 mb-1">{sender?.name}</p>
        )}
        <p className="leading-relaxed whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  )
}