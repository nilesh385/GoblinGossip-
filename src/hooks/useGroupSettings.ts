import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groups } from "@/lib/api";

export const useGroupSettings = (groupId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateSettings, isLoading } = useMutation({
    mutationFn: (settings: any) => groups.updateSettings(groupId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries(["group", groupId]);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return {
    updateSettings,
    isLoading,
    error,
  };
};
