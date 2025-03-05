import { useQuery, useMutation } from "@tanstack/react-query";
import { Protocol } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

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

export function useUserInteractions(address: string) {
  return useQuery<{ protocolId: number; count: number }[]>({
    queryKey: ["/api/interactions", address],
    enabled: !!address,
  });
}

export function useUpdateInteraction() {
  return useMutation({
    mutationFn: async ({ protocolId, address }: { protocolId: number; address: string }) => {
      await apiRequest("POST", "/api/interactions", { protocolId, address });
    },
  });
}
