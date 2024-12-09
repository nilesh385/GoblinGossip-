import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groups } from "@/lib/api";

export const useGroupMembers = (groupId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => groups.getMembers(groupId),
  });

  const { mutate: updateMemberRole } = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      groups.updateMemberRole(groupId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupMembers", groupId]);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const { mutate: removeMember } = useMutation({
    mutationFn: (memberId: string) => groups.removeMember(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupMembers", groupId]);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return {
    members,
    isLoading,
    error,
    updateMemberRole,
    removeMember,
  };
};
