import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { Badge } from "@/components/ui/badge";

export const FriendRequestsDialog = () => {
  const { requests, isLoading, handleRequest } = useFriendRequests();
  console.log(requests);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {requests && requests.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {requests.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex justify-center p-4">Loading...</div>
          ) : requests && requests.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No pending friend requests
            </div>
          ) : (
            <div className="space-y-4">
              {requests &&
                requests.map((request) => (
                  <div
                    key={request?._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={request?.profilePic}
                          alt={request?.username}
                        />
                        <AvatarFallback>
                          {request?.username?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request?.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          @{request?.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRequest(request?._id, "accept")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequest(request?._id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
