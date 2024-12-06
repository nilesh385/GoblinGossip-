import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import { users } from "@/lib/api";
import { UserPlus2Icon } from "lucide-react";

interface Friend {
  _id: string;
  username: string;
  fullName: string;
  profilePic: string;
}

export const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await users.getAllFriends();
        setFriends(response?.friends);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [token, user?._id]);

  const startChat = async (friendId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/conversations",
        { participantId: friendId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActiveConversation(response.data._id);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4 flex justify-between">
        <h2 className="text-2xl font-bold ">Friends</h2>
        <Button size={"icon"}>
          <UserPlus2Icon />
        </Button>
        <div className="grid gap-4">
          {friends &&
            friends.length > 0 &&
            friends.map((friend) => (
              <Button
                key={friend._id}
                variant="ghost"
                className="w-full flex items-center gap-4 justify-start h-auto p-4"
                onClick={() => startChat(friend._id)}
              >
                <Avatar>
                  <AvatarImage src={friend.profilePic} alt={friend.username} />
                  <AvatarFallback>{friend.username[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">{friend.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    @{friend.username}
                  </p>
                </div>
              </Button>
            ))}
          {friends && friends.length === 0 && (
            <div className="w-full flex items-center gap-4 justify-start h-auto p-4 text-muted-foreground text-xl">
              Add some friends by searching using email or username.
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
