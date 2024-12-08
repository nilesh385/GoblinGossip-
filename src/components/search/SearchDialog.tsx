import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import useChatStore from "@/store/chatStore";
import { conversations_api } from "@/lib/api";

export const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );

  const handleStartChat = async (userId: string) => {
    try {
      const response = await conversations_api.create(userId);
      setActiveConversation(response._id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <SearchBar onResults={setResults} onLoading={setIsLoading} />
          <SearchResults
            results={results}
            isLoading={isLoading}
            onStartChat={handleStartChat}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
