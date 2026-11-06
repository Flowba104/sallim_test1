import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

// 사진 한 장 → 긴 변 1024px, JPEG 0.7 → base64 (서버 한도 3MB 대비)
export async function toBase64(uri: string, width: number, height: number): Promise<string> {
  const long = Math.max(width, height);
  const resize = long > 1024 ? [{ resize: width >= height ? { width: 1024 } : { height: 1024 } }] : [];
  const out = await manipulateAsync(uri, resize, { compress: 0.7, format: SaveFormat.JPEG, base64: true });
  if (!out.base64) throw new Error("사진을 읽지 못했어요.");
  return out.base64;
}

// 앨범에서 한 장. 취소면 null. (시스템 사진 선택기라 별도 권한 요청 없음)
export async function pickFromLibrary(): Promise<{ uri: string; width: number; height: number } | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1 });
  return res.canceled ? null : res.assets[0];
}
