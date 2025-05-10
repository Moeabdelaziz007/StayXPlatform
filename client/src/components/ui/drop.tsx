import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

const dropVariants = cva(
  "rounded-xl border p-4 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-dark-card border-[#2A2A2A] text-gray-light",
        crypto: "bg-dark-card border-[#F7931A]/30 text-gray-light",
        tech: "bg-dark-card border-[#2A2A2A] text-gray-light",
        featured: "bg-dark-card border-neon-green text-gray-light gradient-border",
        ai: "bg-gradient-to-r from-dark-card to-[#2A2A2A] border border-neon-green/30 text-gray-light",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface DropProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropVariants> {
  content: string
  user?: {
    name: string
    avatar?: string
    username?: string
  }
  timestamp?: Date | string
  likes?: number
  comments?: number
  tags?: string[]
  media?: {
    type: 'image' | 'video' | 'link'
    url: string
    preview?: string
  }
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
}

const Drop = React.forwardRef<HTMLDivElement, DropProps>(
  ({ 
    className, 
    variant, 
    content,
    user,
    timestamp,
    likes = 0,
    comments = 0,
    tags = [],
    media,
    onLike,
    onComment,
    onShare,
    ...props 
  }, ref) => {
    const formattedTime = timestamp 
      ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
      : null

    return (
      <div
        className={cn(dropVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {/* User info and timestamp */}
        {user && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-dark-lighter text-neon-green">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-medium text-sm text-gray-light">{user.name}</div>
                {user.username && (
                  <div className="text-xs text-gray-medium">@{user.username}</div>
                )}
              </div>
            </div>
            
            {formattedTime && (
              <div className="text-xs text-gray-medium">{formattedTime}</div>
            )}
          </div>
        )}
        
        {/* Main content */}
        <div className="mb-3 text-sm whitespace-pre-line">{content}</div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, i) => (
              <span key={i} className="text-neon-green text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Media */}
        {media && (
          <div className="mb-3 rounded-lg overflow-hidden">
            {media.type === 'image' && (
              <img 
                src={media.url} 
                alt="Post media" 
                className="w-full h-auto object-cover rounded-lg"
              />
            )}
            {media.type === 'video' && (
              <video 
                src={media.url} 
                controls 
                className="w-full h-auto rounded-lg"
              />
            )}
            {media.type === 'link' && (
              <a 
                href={media.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block p-3 rounded-lg bg-dark-lighter hover:bg-dark-lighter/80 transition-colors"
              >
                <div className="flex items-center">
                  {media.preview && (
                    <img 
                      src={media.preview} 
                      alt="Link preview" 
                      className="w-12 h-12 mr-3 rounded object-cover"
                    />
                  )}
                  <span className="text-sm text-neon-green underline truncate">
                    {media.url}
                  </span>
                </div>
              </a>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-4 border-t border-[#2A2A2A] pt-3">
          <Button 
            onClick={onLike} 
            variant="ghost" 
            size="sm" 
            className="text-gray-medium hover:text-neon-green"
          >
            <i className="ri-heart-line mr-1"></i> {likes}
          </Button>
          
          <Button 
            onClick={onComment} 
            variant="ghost" 
            size="sm" 
            className="text-gray-medium hover:text-neon-green"
          >
            <i className="ri-chat-1-line mr-1"></i> {comments}
          </Button>
          
          <Button 
            onClick={onShare}
            variant="ghost" 
            size="sm" 
            className="text-gray-medium hover:text-neon-green"
          >
            <i className="ri-share-line mr-1"></i> Share
          </Button>
        </div>
      </div>
    )
  }
)
Drop.displayName = "Drop"

export { Drop, dropVariants }