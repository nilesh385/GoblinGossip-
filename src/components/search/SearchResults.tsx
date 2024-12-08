import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { users } from "@/lib/api";
import { toast } from "sonner";

interface SearchResultsProps {
  results: any[];
  isLoading: boolean;
  onStartChat: (userId: string) => void;
}

export const SearchResults = ({
  results,
  isLoading,
  onStartChat,
}: SearchResultsProps) => {
  const handleAddFriend = async (userId: string) => {
    try {
      await users.sendFriendRequest(userId);
      toast.success("Friend request sent!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send friend request"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 p-2">
        {results.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.profilePic} alt={user.username} />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAddFriend(user._id)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
              {/* <Button
                variant="outline"
                size="icon"
                onClick={() => onStartChat(user._id)}
              >
                <UserCheck className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
