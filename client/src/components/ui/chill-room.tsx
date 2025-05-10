import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const chillRoomVariants = cva(
  "rounded-xl border transition-all duration-300 p-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-dark-card border-[#2A2A2A] text-gray-light hover:bg-dark-lighter",
        active: "bg-dark-lighter border-neon-green text-gray-light",
        crypto: "bg-dark-card border-[#2A2A2A] text-gray-light crypto-grid hover:bg-dark-lighter",
        tech: "bg-dark-card border-[#2A2A2A] text-gray-light space-dots hover:bg-dark-lighter",
        trending: "bg-dark-card border-neon-green/30 text-gray-light hover:bg-dark-lighter relative overflow-hidden",
      },
      size: {
        default: "",
        sm: "p-3",
        lg: "p-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ChillRoomProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chillRoomVariants> {
  name: string
  description?: string
  icon?: string
  members?: number
  unreadCount?: number
  isLive?: boolean
  onlineMembers?: {
    name: string
    avatar?: string
  }[]
  maxOnlineAvatars?: number
}

const ChillRoom = React.forwardRef<HTMLDivElement, ChillRoomProps>(
  ({ 
    className, 
    variant, 
    size, 
    name, 
    description, 
    icon, 
    members, 
    unreadCount,
    isLive,
    onlineMembers = [],
    maxOnlineAvatars = 3,
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(chillRoomVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {variant === 'trending' && (
          <div className="absolute -right-8 -top-8 w-16 h-16 bg-neon-green/10 rounded-full blur-lg"></div>
        )}
        
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-dark-lighter text-neon-green">
              <i className={icon}></i>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium font-poppins text-gray-light truncate">{name}</h3>
              {isLive && (
                <Badge variant="destructive" className="h-5 px-1.5 bg-red-600 text-white text-xs">LIVE</Badge>
              )}
              {unreadCount && unreadCount > 0 && (
                <Badge variant="default" className="h-5 px-1.5 bg-neon-green text-dark text-xs">{unreadCount}</Badge>
              )}
            </div>
            
            {description && (
              <p className="text-xs text-gray-medium truncate">{description}</p>
            )}
          </div>
        </div>
        
        {/* Online members & total count */}
        {(members || onlineMembers.length > 0) && (
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              {onlineMembers.slice(0, maxOnlineAvatars).map((member, i) => (
                <Avatar 
                  key={i} 
                  className={`h-6 w-6 border border-dark-card ${i > 0 ? '-ml-2' : ''}`}
                >
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-dark-lighter text-neon-green text-xs">
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              
              {onlineMembers.length > maxOnlineAvatars && (
                <div className="h-6 w-6 rounded-full bg-dark-lighter text-gray-light border border-dark-card -ml-2 flex items-center justify-center text-xs">
                  +{onlineMembers.length - maxOnlineAvatars}
                </div>
              )}
            </div>
            
            {members && (
              <div className="text-xs text-gray-medium">
                {members} {members === 1 ? 'member' : 'members'}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
ChillRoom.displayName = "ChillRoom"

export { ChillRoom, chillRoomVariants }