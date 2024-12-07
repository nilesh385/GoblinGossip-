import { useState, useEffect } from "react";
import { toast } from "sonner";
import { users } from "@/lib/api";
import { FriendRequest } from "@/types";
import { getSocket } from "@/lib/socket";

export const useFriendRequests = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await users.getPendingFriendRequests();
        console.log(response);
        setRequests(response);
      } catch (error) {
        toast.error("Failed to fetch friend requests");
      } finally {
        setIsLoading(false);
      }
    };

    const socket = getSocket();
    socket?.on("friendRequest", (request: FriendRequest) => {
      setRequests((prev) => [...prev, request]);
      toast.info(`New friend request from ${request?.username}`);
    });

    socket?.on("friendRequestAccepted", (request: FriendRequest) => {
      setRequests((prev) => prev.filter((req) => req._id !== request._id));
      toast.success(`${request?.username} accepted your friend request`);
    });

    fetchRequests();

    return () => {
      socket?.off("friendRequest");
      socket?.off("friendRequestAccepted");
    };
  }, []);

  const handleRequest = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    try {
      await users[
        action === "accept" ? "acceptFriendRequest" : "rejectFriendRequest"
      ](requestId);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      toast.success(`Friend request ${action}ed`);
    } catch (error) {
      toast.error(`Failed to ${action} friend request`);
    }
  };

  return { requests, isLoading, handleRequest };
};
