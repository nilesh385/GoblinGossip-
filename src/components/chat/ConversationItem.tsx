import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useChatStore from '@/store/chatStore';
import { formatTime } from '@/lib/utils';

interface ConversationItemProps {
  conversation: {
    _id: string;
    name?: string;
    participants: {
      _id: string;
      username: string;
      profilePic: string;
    }[];
    lastMessage?: {
      content: string;
      createdAt: string;
    };
    isGroup?: boolean;
  };
  onClick: () => void;
}

export const ConversationItem = ({ conversation, onClick }: ConversationItemProps) => {
  const activeConversation = useChatStore((state) => state.activeConversation);
  const onlineUsers = useChatStore((state) => state.onlineUsers);

  const isActive = activeConversation?._id === conversation._id;
  const isOnline = conversation.participants.some(
    (participant) => onlineUsers.includes(participant._id)
  );

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full flex items-center gap-3 p-3 h-auto justify-start hover:bg-accent',
        isActive && 'bg-accent'
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage
          src={conversation.isGroup ? undefined : conversation.participants[0].profilePic}
          alt={conversation.name || conversation.participants[0].username}
        />
        <AvatarFallback>
          {conversation.isGroup ? (
            <User className="h-5 w-5" />
          ) : (
            conversation.participants[0].username[0]
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="font-medium truncate">
            {conversation.name || conversation.participants[0].username}
          </p>
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {formatTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          {conversation.lastMessage ? (
            <p className="text-sm text-muted-foreground truncate">
              {conversation.lastMessage.content}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          )}
          {!conversation.isGroup && isOnline && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </div>
      </div>
    </Button>
  );
};