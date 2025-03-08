import { useQuery, useMutation } from "@tanstack/react-query";
import { Protocol } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export function useProtocols() {
  return useQuery<Protocol[]>({
    queryKey: ["/api/protocols"],
  });
}

export function useProtocol(id: number) {
  return useQuery<Protocol>({
    queryKey: ["/api/protocols", id],
  });
}

export function useUserInteractions() {
  return useQuery({
    queryKey: ["/api/user/interactions"],
  });
}

export function useUpdateInteraction() {
  return useMutation({
    mutationFn: async ({ protocolId }: { protocolId: number }) => {
      await apiRequest("POST", "/api/interactions", { protocolId });
    },
    onSuccess: () => {
      // Invalidate both protocol and user interaction queries
      queryClient.invalidateQueries({ queryKey: ["/api/user/interactions"] });
    },
  });
}