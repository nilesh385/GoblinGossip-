import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import axios from "axios";

interface ChatWindowProps {
  socket: Socket | null;
}

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export const ChatWindow = ({ socket }: ChatWindowProps) => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const activeConversation = useChatStore((state) => state.activeConversation);
  const messages = useChatStore((state) => state.messages);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeConversation) {
      socket?.emit("joinRoom", activeConversation);
      return () => {
        socket?.emit("leaveRoom", activeConversation);
      };
    }
  }, [activeConversation, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket?.on("typing", ({ username, conversationId }) => {
      if (conversationId === activeConversation) {
        setIsTyping(true);
        setTypingUser(username);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket?.off("typing");
    };
  }, [socket, activeConversation]);

  const emitTyping = () => {
    socket?.emit("typing", {
      conversationId: activeConversation,
      username: user?.username,
    });
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!activeConversation) return;

    try {
      await axios.post(
        "http://localhost:3000/api/messages",
        {
          conversationId: activeConversation,
          content: data.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      form.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender._id === user?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender._id === user?._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-sm text-muted-foreground">
              {typingUser} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-t p-4 flex gap-2 bg-card"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Type a message..."
                    onKeyDown={emitTyping}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};
