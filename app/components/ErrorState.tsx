import { useRouter } from "expo-router";
import { ApiError } from "../lib/api";
import { t } from "../lib/copy";
import Button from "./Button";
import StatusCard from "./StatusCard";

type Props = {
  error: ApiError;
  onRetry?: () => void;    // 같은 요청 다시
  onEdit?: () => void;     // 입력 수정(질문 화면)
  onRetake?: () => void;   // 사진 다시 찍기
  retrying?: boolean;
};

// ErrorCode → 상태 화면. network=연결 실패(오프라인 단정 대신 중립 문구는 R1 문구가 담당).
export default function ErrorState({ error, onRetry, onEdit, onRetake, retrying }: Props) {
  const router = useRouter();
  const code = error.code;
  const photoBad = code === "invalid_image" || code === "image_too_large";
  const kind = code === "network" ? "offline" : code === "provider_timeout" ? "time" : "error";
  const title = code === "network" ? t("status.offline.title") : code === "provider_timeout" ? t("status.timeout.title")
    : photoBad ? t("status.photo.title") : code === "region_not_found" ? t("status.region.title") : t("status.serverError.title");
  const body = t(`status.error.${code}`);
  const retry = onRetry && !photoBad && code !== "region_not_found"
    && <Button key="r" label={t("common.retry")} busy={retrying} onPress={onRetry} />;
  return (
    <StatusCard kind={kind} tone="error" title={title} body={body}>
      {retry}
      {photoBad && onRetake && <Button label={t("result.lowConfidence.retryPhoto")} onPress={onRetake} />}
      {code === "region_not_found" && <Button label={t("home.pickRegion")} onPress={() => router.push("/region")} />}
      {onEdit && <Button variant="secondary" label={t("status.edit")} haptic={false} onPress={onEdit} />}
      {(code === "provider_timeout" || code === "provider_error" || photoBad) && (
        <Button variant="secondary" label={t("capture.button.askText")} haptic={false} onPress={() => router.push("/ask")} />
      )}
    </StatusCard>
  );
}
