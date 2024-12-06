import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { Loader2 } from "lucide-react";
import { conversations_api } from "@/lib/api";
import useChatStore from "@/store/chatStore";
import { toast } from "sonner";

interface Conversation {
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
}

export const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await conversations_api.getAll();
        setConversations(response.data);
      } catch (error: any) {
        console.log(error.message);
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {conversations &&
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              onClick={() => setActiveConversation(conversation)}
            />
          ))}
      </div>
    </ScrollArea>
  );
};
