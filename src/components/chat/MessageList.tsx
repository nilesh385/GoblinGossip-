import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import useAuthStore from '@/store/authStore';
import useChatStore from '@/store/chatStore';

export const MessageList = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((state) => state.messages);
  const user = useAuthStore((state) => state.user);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const activeConversation = useChatStore((state) => state.activeConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            content={message.content}
            sender={message.sender}
            createdAt={message.createdAt}
            isOwnMessage={message.sender._id === user?._id}
          />
        ))}
        {typingUsers[activeConversation] && (
          <TypingIndicator username={typingUsers[activeConversation]} />
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};