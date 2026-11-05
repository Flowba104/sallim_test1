import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getRegionId } from "./region";

// 화면이 포커스될 때마다 저장된 동네를 다시 읽는다. undefined=로딩, null=미선택
export function useRegion() {
  const [id, setId] = useState<string | null | undefined>(undefined);
  useFocusEffect(useCallback(() => { getRegionId().then(setId); }, []));
  return id;
}
