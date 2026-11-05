import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

// 카메라/앨범에서 사진 한 장 → 긴 변 1024px, JPEG 0.7 → base64. 취소/권한 거부면 null.
export async function pickImageBase64(source: "camera" | "library"): Promise<string | null> {
  const perm =
    source === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) throw new Error("권한이 필요해요. 설정에서 허용해 주세요.");

  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 1 };
  const res =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(opts)
      : await ImagePicker.launchImageLibraryAsync(opts);
  if (res.canceled) return null;

  const { uri, width, height } = res.assets[0];
  const long = Math.max(width, height);
  const resize = long > 1024 ? [{ resize: width >= height ? { width: 1024 } : { height: 1024 } }] : [];
  const out = await manipulateAsync(uri, resize, { compress: 0.7, format: SaveFormat.JPEG, base64: true });
  return out.base64 ?? null;
}
