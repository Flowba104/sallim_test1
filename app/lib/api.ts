import type {
  ApiErrorBody, AskRequest, AskResponse, ErrorCode, FollowUpRequest, Region, ScheduleResponse,
} from "./api-types";

const BASE = process.env.EXPO_PUBLIC_API_URL; // 없으면 mock 모드
export const isMock = !BASE;

const SOURCES = [{ title: "환경부 분리배출 안내(mock)", url: "https://example.com", updated: "2026-11" }];

const MOCK_REGIONS: Region[] = [
  { id: "seoul-gwanak", name: "서울특별시 관악구" },
  { id: "seoul-mapo", name: "서울특별시 마포구" },
];

const MOCK_PET: AskResponse = {
  item_key: "pet_bottle_clear",
  item_name: "투명 페트병",
  category: "투명페트",
  answer: "투명 페트병은 라벨을 떼고 비워서 투명페트 수거함에 버려요.",
  steps: ["내용물 비우고 헹구기", "라벨 떼기", "찌그러뜨려 뚜껑 닫기"],
  next_days: ["화", "금"],
  time: "18:00~24:00",
  note: "예시: 단독주택·상가 기준이에요. 아파트는 단지 안내문을 확인하세요.",
  confident: true,
  follow_up: { key: "has_label", question: "라벨이나 스티커가 아직 붙어 있나요?" },
  sources: SOURCES,
};

const MOCK_UNKNOWN: AskResponse = {
  item_key: null, item_name: null, category: null,
  answer: "다시 찍거나 이름으로 물어봐 주세요",
  steps: [], next_days: [], time: null, confident: false, follow_up: null, sources: [],
};

const MOCK_SCHEDULE: ScheduleResponse = {
  region_id: "seoul-gwanak",
  today: "화",
  today_categories: ["플라스틱", "비닐"],
  week: {
    월: ["일반쓰레기", "음식물"], 화: ["플라스틱", "비닐"], 수: ["일반쓰레기", "음식물"],
    목: ["종이", "캔·고철"], 금: ["플라스틱", "비닐"], 토: [], 일: ["일반쓰레기", "음식물"],
  },
  time: "18:00~24:00",
  note: "예시: 단독주택·상가 기준이에요. 아파트는 단지 안내문을 확인하세요.",
  sources: SOURCES,
};

const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 300));

// code: 서버 ErrorCode 또는 "network"(fetch 실패·15초 타임아웃 = 오프라인/서버 연결 실패)
export class ApiError extends Error {
  constructor(public code: ErrorCode | "network", message: string) { super(message); }
}

const TIMEOUT_MS = 15000;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(BASE + path, { ...init, signal: ctl.signal, headers: { "Content-Type": "application/json" } });
  } catch {
    throw new ApiError("network", "서버에 연결하지 못했어요. 네트워크를 확인해 주세요.");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const body: Partial<ApiErrorBody> | null = await res.json().catch(() => null);
    throw new ApiError(body?.error?.code ?? "internal_error", body?.error?.message ?? `서버 오류 (${res.status})`);
  }
  return res.json();
}

const post = <T,>(path: string, body: unknown) =>
  http<T>(path, { method: "POST", body: JSON.stringify(body) });

export function getRegions(): Promise<Region[]> {
  return isMock ? delay(MOCK_REGIONS) : http("/regions");
}

export function ask(req: AskRequest): Promise<AskResponse> {
  if (!isMock) return post("/ask", req);
  // mock: 사진이거나 "페트"가 들어간 질문만 인식, 나머지는 unknown
  const hit = req.image_base64 || req.question?.includes("페트");
  return delay(hit ? MOCK_PET : MOCK_UNKNOWN);
}

export function followUp(req: FollowUpRequest): Promise<AskResponse> {
  if (!isMock) return post("/ask/followup", req);
  const labeled = req.state.has_label;
  return delay({
    ...MOCK_PET,
    follow_up: null,
    answer: labeled
      ? "라벨을 먼저 떼야 해요. 라벨은 비닐류로 따로 버려요."
      : MOCK_PET.answer,
  });
}

export function getSchedule(regionId: string): Promise<ScheduleResponse> {
  return isMock
    ? delay({ ...MOCK_SCHEDULE, region_id: regionId })
    : http(`/schedule?region_id=${encodeURIComponent(regionId)}`);
}
