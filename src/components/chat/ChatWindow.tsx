import { useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { messages } from '@/lib/api';
import useChatStore from '@/store/chatStore';
import { getSocket } from '@/lib/socket';
import { toast } from 'sonner';

export const ChatWindow = () => {
  const activeConversation = useChatStore((state) => state.activeConversation);
  const setMessages = useChatStore((state) => state.setMessages);

  useEffect(() => {
    if (activeConversation) {
      const socket = getSocket();
      socket?.emit('joinRoom', activeConversation);
      
      const fetchMessages = async () => {
        try {
          const data = await messages.getMessages(activeConversation);
          setMessages(data);
        } catch (error) {
          toast.error('Failed to load messages');
        }
      };

      fetchMessages();

      return () => {
        socket?.emit('leaveRoom', activeConversation);
      };
    }
  }, [activeConversation, setMessages]);

  const handleViewProfile = () => {
    // Implement profile viewing logic
  };

  const handleLeaveGroup = () => {
    // Implement group leaving logic
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {activeConversation && (
        <ChatHeader 
          conversation={activeConversation}
          onViewProfile={handleViewProfile}
          onLeaveGroup={handleLeaveGroup}
        />
      )}
      <MessageList />
      <MessageInput />
    </div>
  );
};