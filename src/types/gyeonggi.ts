export interface MerchantHead {
    list_total_count?: number;
    RESULT?: {
        CODE: string;
        MESSAGE: string;
    };
    api_version?: string;
}

export interface MerchantRow {
    SIGUN_NM: string;              // 시군명
    CMPNM_NM: string;              // 가맹점명
    INDUTYPE_NM: string;           // 업종명
    REFINE_ROADNM_ADDR: string;     // 도로명주소
    REFINE_LOTNO_ADDR: string;      // 지번주소
    REFINE_WGS84_LAT: string;       // 위도
    REFINE_WGS84_LOGT: string;      // 경도
    TELNO?: string;                // 전화번호 (샘플엔 없지만 존재 가능)
    BIZCOND_NM?: string;           // 업태명 (샘플엔 없지만 존재 가능)
    LEAD_TAX_MAN_STATE: string;    // 사업자상태 (예: 계속사업자, 휴업자)
    LEAD_TAX_MAN_STATE_CD: string; // 사업자상태코드
    REFINE_ZIPNO: string;          // 우편번호
    BIZREGNO: string;              // 사업자등록번호
}

export interface GyeonggiApiResponse {
    RegionMnyFacltStus: [
        { head: MerchantHead[] },
        { row: MerchantRow[] }
    ];
}
