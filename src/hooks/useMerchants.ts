import { useQuery } from "@tanstack/react-query";
import { fetchMerchants } from "../api/gyeonggiApi";

export const useMerchants = (sigun?: string) => {
    return useQuery({
        queryKey: ["merchants", sigun],
        queryFn: () => fetchMerchants(sigun ?? ""),
        enabled: !!sigun, // Only fetch when a city is selected
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
