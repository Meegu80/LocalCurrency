import { Map, MapMarker, CustomOverlayMap, MarkerClusterer } from "react-kakao-maps-sdk";
import { useState, useEffect } from "react";
import type { MerchantRow } from "./types/gyeonggi";
import { X } from "lucide-react";
import { MAP_CENTER } from "./constants/gyeonggi";

interface MerchantMapProps {
    merchants: MerchantRow[];
    loading: boolean;
}

const MerchantMap = ({ merchants, loading }: MerchantMapProps) => {
    const [selectedMerchant, setSelectedMerchant] = useState<MerchantRow | null>(null);
    const [mapState, setMapState] = useState({
        center: MAP_CENTER,
        level: 4
    });

    useEffect(() => {
        // 데이터가 1000개 근처(전체표시)이면 지도를 넓게 보여줌
        if (merchants.length > 500) {
            setMapState({
                center: { lat: 37.5, lng: 127.1 }, // 경기도 중심부
                level: 9
            });
        } else if (merchants.length > 0) {
            // 특정 시/군일 경우 첫 번째 마커 근처로 이동
            const first = merchants[0];
            setMapState({
                center: { 
                    lat: parseFloat(first.REFINE_WGS84_LAT), 
                    lng: parseFloat(first.REFINE_WGS84_LOGT) 
                },
                level: 5
            });
        }
    }, [merchants]);

    return (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <Map
                center={mapState.center}
                level={mapState.level}
                style={{ width: "100%", height: "100%" }}
            >
                <MarkerClusterer
                    averageCenter={true} // 클러스터 마커의 위치를 평균 위치로 설정
                    minLevel={6} // 클러스터가 생성될 최소 지도 레벨
                    disableClickZoom={false} // 클러스터 클릭 시 확대 여부
                >
                    {merchants.map((merchant, idx) => {
                        const lat = parseFloat(merchant.REFINE_WGS84_LAT);
                        const lng = parseFloat(merchant.REFINE_WGS84_LOGT);

                        if (isNaN(lat) || isNaN(lng)) return null;

                        return (
                            <MapMarker
                                key={`${merchant.CMPNM_NM}-${idx}`}
                                position={{ lat, lng }}
                                onClick={() => setSelectedMerchant(merchant)}
                            />
                        );
                    })}
                </MarkerClusterer>

                {selectedMerchant && (
                    <CustomOverlayMap
                        position={{
                            lat: parseFloat(selectedMerchant.REFINE_WGS84_LAT),
                            lng: parseFloat(selectedMerchant.REFINE_WGS84_LOGT),
                        }}
                        yAnchor={1.2}
                    >
                        <div className="bg-white p-4 rounded-xl shadow-2xl min-w-[240px] border border-blue-100 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                    {selectedMerchant.CMPNM_NM}
                                </h3>
                                <button
                                    onClick={() => setSelectedMerchant(null)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="space-y-1.5 text-sm text-gray-600">
                                <p className="flex items-start gap-1">
                                    <span className="font-semibold text-blue-600 shrink-0">주소:</span>
                                    <span>({selectedMerchant.REFINE_ZIPNO}) {selectedMerchant.REFINE_ROADNM_ADDR || selectedMerchant.REFINE_LOTNO_ADDR}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-blue-600">업종:</span> {selectedMerchant.INDUTYPE_NM}
                                </p>
                                <p>
                                    <span className="font-semibold text-blue-600">상태:</span>{' '}
                                    <span className={selectedMerchant.LEAD_TAX_MAN_STATE === '계속사업자' ? 'text-green-600 font-bold' : 'text-red-600'}>
                                        {selectedMerchant.LEAD_TAX_MAN_STATE}
                                    </span>
                                </p>
                                {selectedMerchant.TELNO && (
                                    <p>
                                        <span className="font-semibold text-blue-600">전화:</span> {selectedMerchant.TELNO}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                <button 
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    onClick={() => window.open(`https://map.kakao.com/link/to/${selectedMerchant.CMPNM_NM},${selectedMerchant.REFINE_WGS84_LAT},${selectedMerchant.REFINE_WGS84_LOGT}`, "_blank")}
                                >
                                    길찾기
                                </button>
                            </div>
                        </div>
                    </CustomOverlayMap>
                )}
            </Map>
            {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
};

export default MerchantMap;