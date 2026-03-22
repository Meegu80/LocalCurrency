import { useState } from "react";
import { useMerchants } from "./hooks/useMerchants";
import MerchantMap from "./Map";
import { Search, MapPin, Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CITIES } from "./constants/gyeonggi";
import type { MerchantRow } from "./types/gyeonggi";

const queryClient = new QueryClient();

const ALL_CITY_OPTIONS = ["전체표시", ...CITIES];

function AppContent() {
    const [selectedSigun, setSelectedSigun] = useState("전체표시");
    const [searchTerm, setSearchTerm] = useState("");
    const { data: merchants = [], isLoading, isFetching } = useMerchants(selectedSigun);

    const filteredMerchants = merchants.filter((merchant: MerchantRow) =>
        merchant.CMPNM_NM.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.INDUTYPE_NM.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
                            <MapPin className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                            경기도 지역화폐 가맹점 지도
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        {isFetching && <Loader2 className="animate-spin text-blue-600" size={16} />}
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                            총 {merchants.length.toLocaleString()}개 가맹점
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Search & Filter Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* City Selector */}
                    <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-100 p-1.5 rounded-lg">
                                <Search size={18} className="text-blue-600" />
                            </div>
                            <h2 className="font-bold text-lg text-slate-800">시/군 선택</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                            {ALL_CITY_OPTIONS.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedSigun(city)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        selectedSigun === city
                                            ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                                            : "bg-slate-50 text-slate-600 border border-slate-100 hover:border-blue-200 hover:bg-blue-50"
                                    }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Merchant Search */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-100 p-1.5 rounded-lg">
                                <Search size={18} className="text-indigo-600" />
                            </div>
                            <h2 className="font-bold text-lg text-slate-800">가맹점 검색</h2>
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="가맹점명 또는 업종 검색..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-slate-300"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        </div>
                        <p className="mt-3 text-xs text-slate-400 pl-1 font-medium">
                            {searchTerm ? `검색 결과: ${filteredMerchants.length}개` : "입력하신 키워드로 목록을 필터링합니다."}
                        </p>
                    </section>
                </div>

                {/* Map Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold text-2xl text-slate-800 tracking-tight">
                                {selectedSigun} 가맹점 현황
                            </h2>
                            {searchTerm && (
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded border border-indigo-100 animate-in fade-in slide-in-from-left-2">
                                    "{searchTerm}" 검색 중
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm font-medium">
                            목록의 상위 1,000개 데이터를 표시합니다.
                        </p>
                    </div>
                    <MerchantMap merchants={filteredMerchants} loading={isLoading} />
                </section>
            </main>

            <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
                <p>© 2026 경기도 지역화폐 가맹점 지도 - Public Data API Project</p>
                <p className="mt-1 italic">Data provided by Gyeonggi Data Portal</p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
        </QueryClientProvider>
    );
}

export default App;