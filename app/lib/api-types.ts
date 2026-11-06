// 원본: shared/api-types.ts, 수정 금지 (shared/api-types.ts와 동기화)
// SaLLiM API 계약 — 주인: lead. 바꾸려면 lead에게 메일.
// 서버 쪽 같은 모양: server/app/schemas.py

export type Category =
  | "투명페트" | "플라스틱" | "종이" | "종이팩" | "캔·고철" | "유리병"
  | "비닐" | "스티로폼" | "일반쓰레기" | "음식물" | "전용수거" | "대형폐기물";

export type Weekday = "월" | "화" | "수" | "목" | "금" | "토" | "일";

export type Source = { title: string; url: string; updated: string };

export type Region = { id: string; name: string }; // id 예: "seoul-gwanak"

// 배출법이 갈리는 상태만
export type ItemState = {
  has_label?: boolean;
  has_contents?: boolean;
  is_dirty?: boolean;
  is_coated?: boolean;
};

export type AskRequest = {
  region_id: string;
  question?: string;     // 텍스트 질문
  image_base64?: string; // JPEG, 긴 변 1024px. question/image 중 하나는 필수
};

// 되묻기 답변 → VLM 다시 안 부름
export type FollowUpRequest = {
  region_id: string;
  item_key: string;
  state: ItemState;
};

export type AskResponse = {
  item_key: string | null;   // 못 찾으면 null
  item_name: string | null;
  category: Category | null;
  answer: string;            // 화면에 보여줄 한두 문장
  steps: string[];           // 배출 순서
  next_days: string[];       // 이 카테고리 배출 요일 예: ["화", "금"] (모르면 [])
  time: string | null;       // "18:00~24:00"
  confident: boolean;
  follow_up: { key: keyof ItemState; question: string } | null;
  sources: Source[];
  note?: string | null;      // 동네 예외 안내 (예: 아파트 단지별 요일 다름). 있으면 요일 옆에 꼭 표시
};

export type ScheduleResponse = {
  region_id: string;
  today: string;                    // "화"
  today_categories: string[];       // 오늘 내놓을 수 있는 것
  week: Record<string, string[]>;   // {"월": ["일반쓰레기"], ...}
  time: string | null;
  sources: Source[];
  note?: string | null;             // 동네 예외 안내. 있으면 주간 표 아래 표시
};

// 엔드포인트
// GET  /regions                 -> Region[]
// POST /ask                     AskRequest -> AskResponse
// POST /ask/followup            FollowUpRequest -> AskResponse
// GET  /schedule?region_id=...  -> ScheduleResponse

// 오류 응답 (2xx 아님): 항상 { error: { code, message } }. message는 화면에 그대로 보여도 되는 존댓말.
export type ErrorCode =
  | "invalid_request"   // 422 요청 형식 오류
  | "invalid_image"     // 422 사진을 읽을 수 없음 → 다시 찍기
  | "image_too_large"   // 413 → 다시 찍기 (긴 변 1024px JPEG로 줄여서 보낼 것)
  | "region_not_found"  // 404 → 동네 다시 선택
  | "item_not_found"    // 404 (followup)
  | "not_found"         // 404 없는 경로
  | "provider_timeout"  // 504 사진 분석 12초 초과 → 다시 시도 / 이름으로 묻기
  | "provider_error"    // 502 사진 분석 서비스 장애 → 이름으로 묻기
  | "internal_error";   // 500
export type ApiErrorBody = { error: { code: ErrorCode; message: string } };
// 응답이 아예 없으면(fetch 실패·타임아웃) 앱에서 오프라인/서버 연결 실패로 처리
