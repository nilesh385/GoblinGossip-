import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTime } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  sender: {
    _id: string;
    username: string;
    profilePic: string;
  };
  createdAt: string;
  isOwnMessage: boolean;
}

export const MessageBubble = ({ content, sender, createdAt, isOwnMessage }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start gap-2 max-w-[70%]">
        {!isOwnMessage && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={sender.profilePic} alt={sender.username} />
            <AvatarFallback>{sender.username[0]}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={`rounded-lg p-3 ${
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary'
          }`}
        >
          {!isOwnMessage && (
            <p className="text-xs font-medium mb-1">{sender.username}</p>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          <p className="text-xs mt-1 opacity-70">
            {formatTime(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};