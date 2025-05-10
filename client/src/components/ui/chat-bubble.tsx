import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const chatBubbleVariants = cva(
  "rounded-xl p-3 max-w-[80%] relative",
  {
    variants: {
      variant: {
        default: "bg-dark-card text-gray-light",
        primary: "bg-neon-green text-dark",
        sender: "bg-dark-card text-gray-light ml-auto rounded-tr-none",
        receiver: "bg-dark-lighter text-gray-light mr-auto rounded-tl-none",
        system: "bg-dark-lighter text-gray-medium border border-[#2A2A2A] text-sm italic mx-auto max-w-[90%]",
        bitcoin: "bg-[#F7931A]/10 border border-[#F7931A]/20 text-gray-light",
        ai: "bg-gradient-to-r from-dark-card to-[#2A2A2A] border border-neon-green/30 text-gray-light",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants> {
  message: string
  sender?: {
    name: string
    avatar?: string
    timestamp?: Date | string
  }
  showAvatar?: boolean
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, message, sender, showAvatar = false, ...props }, ref) => {
    const isSenderBubble = variant === 'sender'
    const isReceiverBubble = variant === 'receiver'
    
    const timestamp = sender?.timestamp 
      ? new Date(sender.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : null
    
    return (
      <div
        className={cn(
          "flex items-end gap-2 my-2",
          isSenderBubble ? "justify-end" : "",
          isReceiverBubble ? "justify-start" : "",
          className
        )}
        ref={ref}
        {...props}
      >
        {showAvatar && isReceiverBubble && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender?.avatar} alt={sender?.name || "User"} />
            <AvatarFallback className="bg-dark-lighter text-neon-green text-xs">
              {sender?.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={cn(chatBubbleVariants({ variant }))}>
          <div className="flex flex-col">
            {sender?.name && (variant === 'receiver' || variant === 'ai') && showAvatar && (
              <span className="text-xs text-neon-green font-medium mb-1">{sender.name}</span>
            )}
            <div>{message}</div>
            {timestamp && (
              <div className="text-xs text-right mt-1 opacity-70">
                {timestamp}
              </div>
            )}
          </div>
        </div>
        
        {showAvatar && isSenderBubble && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender?.avatar} alt={sender?.name || "User"} />
            <AvatarFallback className="bg-dark-lighter text-neon-green text-xs">
              {sender?.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }
)
ChatBubble.displayName = "ChatBubble"

export { ChatBubble, chatBubbleVariants }