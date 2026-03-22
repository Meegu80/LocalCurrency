import axios from "axios";
import type { GyeonggiApiResponse, MerchantRow } from "../types/gyeonggi";
import { CITIES } from "../constants/gyeonggi";

const BASE_URL = "https://openapi.gg.go.kr/RegionMnyFacltStus";
const GG_API_KEY = import.meta.env.VITE_GG_API_KEY;

export const fetchMerchants = async (sigun: string): Promise<MerchantRow[]> => {
    if (!GG_API_KEY) {
        console.error("Gyeonggi API Key is missing!");
        return [];
    }

    // "전체표시"일 경우, 각 시/군에서 고르게 데이터를 가져옴 (분산 표시용)
    if (sigun === "전체표시") {
        try {
            const requests = CITIES.map(city =>
                axios.get<GyeonggiApiResponse>(BASE_URL, {
                    params: {
                        KEY: GG_API_KEY,
                        Type: "json",
                        pIndex: 1,
                        pSize: 35, // 31개 시/군 * 35 = 약 1,000개
                        SIGUN_NM: city,
                    },
                })
            );

            const responses = await Promise.all(requests);
            const allRows: MerchantRow[] = [];

            responses.forEach(response => {
                const data = response.data.RegionMnyFacltStus;
                if (data && data[1] && data[1].row) {
                    allRows.push(...data[1].row);
                }
            });

            return allRows;
        } catch (error) {
            console.error("Error fetching multi-city data:", error);
            return [];
        }
    }

    // 단일 시/군 조회
    try {
        const response = await axios.get<GyeonggiApiResponse>(BASE_URL, {
            params: {
                KEY: GG_API_KEY,
                Type: "json",
                pIndex: 1,
                pSize: 1000,
                SIGUN_NM: sigun,
            },
        });

        const data = response.data.RegionMnyFacltStus;
        if (!data || !data[1] || !data[1].row) return [];
        return data[1].row;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};
